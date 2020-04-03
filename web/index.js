(() => {
  const isWorker =
    self.IS_WORKER ||
    (typeof WorkerGlobalScope !== "undefined" &&
      self instanceof WorkerGlobalScope);

  const LOAD = "load";
  const READY = "ready";
  const COMPILED = "compiled";
  const COMPILATION_ERROR = "compilation-error";
  const COMPILE = "compile";
  const EXPLAIN = "explain";
  const EXPLANATION = "explanation";
  const ELABORATE = "elaborate";
  const ELABORATION = "elaboration";
  const EXPLORATION = "exploration";

  const logInfo = self.SKIP_LOGGING ? () => {} : console.info.bind(console);

  let promise = isWorker ? workerMain() : main(window);

  promise.catch((e) => console.error(e));

  async function main(window) {
    await import("../node_modules/codemirror/lib/codemirror.js");
    await import("../node_modules/codemirror/addon/mode/simple.js");
    await import("../node_modules/codemirror/mode/rust/rust.js");

    const document = window.document;
    const querySelector = (selector) => document.querySelector(selector);
    const createElement = (el) => document.createElement(el);

    if (typeof __ANALYTICS_URL__ === "string") {
      fetch(__ANALYTICS_URL__, { method: "POST" });
    }

    const IS_TOUCH_DEVICE = "ontouchstart" in window;

    addClass(
      document.body,
      IS_TOUCH_DEVICE ? "touch-device" : "non-touch-device"
    );

    /* CODEMIRROR INIT */

    const cm = CodeMirror.fromTextArea(querySelector(".codemirror-anchor"), {
      mode: "rust",
      lineNumbers: true,
      theme: "solarized",
      readOnly: IS_TOUCH_DEVICE ? "nocursor" : false,
      indentUnit: 4,
    });

    const codemirrorEl = cm.getWrapperElement();

    addClass(document.body, "codemirror-rendered");

    initialCodeRender(cm);

    /* "REACT" */
    let state = {
      compilation: { state: "pending" },
      editable: false,
    };

    let nonUiState = {
      lastRule: -1,
    };

    const setState = ((renderFn) => {
      let next = {};
      let nextRender = null;

      const doRender = () => {
        const newState = Object.assign({}, state, next);
        const prevState = state;
        state = newState;
        next = {};
        nextRender = null;
        renderFn(prevState);
      };

      return (nextState) => {
        const trueNextState =
          typeof nextState === "function"
            ? nextState({ ...state, ...next })
            : nextState;

        logInfo("setState: ", trueNextState);

        Object.assign(next, trueNextState);

        if (nextRender == null) {
          nextRender = window.requestAnimationFrame(() => doRender());
        }
      };
    })((prevState) => {
      const { compilation } = state;
      const { compilation: prevCompilation } = prevState;

      if (prevCompilation.state !== compilation.state) {
        renderSessionState();
      }

      if (prevCompilation.explanation !== compilation.explanation) {
        renderExplanation();
      }

      if (prevCompilation.elaboration !== compilation.elaboration) {
        renderElaboration();
      }

      if (prevCompilation.hoverEl !== compilation.hoverEl) {
        renderHover();
      }

      if (prevCompilation.address !== compilation.address) {
        renderGeneratedLink();
      }

      renderShowAll(prevState);

      if (prevState.editable !== state.editable) {
        renderEditable();
      }

      if (prevState.showModal !== state.showModal) {
        renderModal();
      }
    });

    /* WORKER */

    const worker = new Worker(window.workerMain, {
      name: "explainer",
    });

    worker.onerror = (e) => console.error(e);

    worker.onmessage = (e) => {
      const { data } = e;
      logInfo("Window received", data.type);
      switch (data.type) {
        case READY:
          compileSession();
          break;
        case COMPILED:
          setState({ compilation: { state: "success" } });
          break;
        case COMPILATION_ERROR:
          setState({ compilation: { state: "error", error: data.error } });
          break;
        case EXPLANATION:
          setState(({ compilation }) => ({
            compilation: { ...compilation, explanation: data.location },
          }));
          onExplanation();
          break;
        case ELABORATION:
          setState(({ compilation }) => ({
            compilation: {
              ...compilation,
              elaboration: data.location != null ? data : null,
            },
          }));
          break;
        case EXPLORATION:
          computeExploration(data.exploration);
          setState(({ compilation }) => ({
            compilation: { ...compilation, exploration: true },
          }));
          break;
        default:
          console.error("Unexpected message in window", data);
      }
    };

    worker.postMessage({
      type: LOAD,
      url: window.workerBundle,
      wasmUrl: window.workerWasm,
    });

    /* HEADER */
    const generateButton = querySelector(".generate");
    const generatedLink = querySelector(".link");
    const toggleEditEButton = querySelector(".toggle-edit");
    const showAllButton = querySelector(".show-all");
    const showAllText = querySelector(".show-all-text");
    const showAllSpinner = querySelector(".show-all > .spinner");

    const modal = querySelector(".modal");
    const overlay = querySelector(".overlay");

    generateButton.addEventListener("click", () => {
      let address = new window.URL(window.location.href);
      let params = new window.URLSearchParams();
      params.append("code", cm.getValue());
      address.search = `?${params.toString()}`;

      setState(({ compilation }) => ({
        compilation: { ...compilation, address: address.toString() },
      }));
    });

    toggleEditEButton.addEventListener("click", () => {
      const newEditable = !state.editable;
      setState({ editable: newEditable });
      cm.setOption("readOnly", newEditable ? false : "nocursor");
    });

    showAllButton.addEventListener("click", () => {
      setState(({ compilation }) => ({
        compilation: {
          ...compilation,
          showAll: !compilation.showAll,
        },
      }));
    });

    querySelector(".whats-this").addEventListener("click", () => {
      setState({ showModal: !state.showModal });
    });

    overlay.addEventListener("click", () => {
      setState({ showModal: false });
    });

    querySelector(".close-modal").addEventListener("click", () => {
      setState({ showModal: false });
    });

    function renderGeneratedLink() {
      const { address } = state.compilation;

      if (address) {
        setDisplay(generateButton, "none");
        removeClass(generatedLink, "hidden");
        generatedLink.href = address;
      } else {
        addClass(generatedLink, "hidden");
        setDisplay(generateButton, null);
      }
    }

    function renderShowAll(prevState) {
      const { compilation: prevCompilation } = prevState;
      const { compilation } = state;

      if (
        compilation.state === prevCompilation.state &&
        compilation.showAll === prevCompilation.showAll &&
        compilation.exploration === prevCompilation.exploration &&
        compilation.empty === prevCompilation.empty
      ) {
        return;
      }

      const canShow = compilation.exploration != null;
      showAllButton.disabled = !canShow;

      const isLoaded =
        canShow || compilation.state === "error" || compilation.empty;
      (isLoaded ? addClass : removeClass)(showAllButton, "show-all-loaded");

      if (compilation.showAll) {
        addClass(codemirrorEl, "show-all-computed");
        setText(showAllText, "Hide elements");
      } else {
        removeClass(codemirrorEl, "show-all-computed");
        setText(showAllText, initialShowAll);
      }
    }

    function renderModal() {
      const { showModal } = state;

      if (showModal) {
        addClass(modal, "show-modal");
        addClass(overlay, "show-modal");
      } else {
        removeClass(modal, "show-modal");
        removeClass(overlay, "show-modal");
      }
    }

    function renderEditable() {
      setText(
        toggleEditEButton,
        state.editable ? "Disable editing" : "Enable editing"
      );
    }

    /* CODE */

    const styleSheet = (() => {
      const styleEl = document.createElement("style");
      document.head.appendChild(styleEl);
      return styleEl.sheet;
    })();

    function initialCodeRender(cm) {
      const codeParam = [...new window.URLSearchParams(location.search)].find(
        ([key, value]) => key === "code"
      );
      const code =
        codeParam != null ? window.decodeURIComponent(codeParam[1]) : null;

      if (code != null && code.trim() !== "") {
        cm.setValue(code);
      } else {
        const local = window.localStorage.getItem("code");
        if (local != null) {
          cm.setValue(local);
        } else {
          cm.setValue(querySelector(".default-code").value);
        }
      }
    }

    cm.on("change", () => {
      setState({
        compilation: { state: "pending" },
      });
      compileSession();
    });

    codemirrorEl.addEventListener("mousemove", (e) => {
      if (nonUiState.computedMarks) {
        setState(({ compilation }) => ({
          compilation: { ...compilation, hoverEl: e.target },
        }));
        return;
      }

      const { compilation } = state;
      const { clientX, clientY } = e;

      if (compilation.state !== "success" || nonUiState.computing) {
        nonUiState.next = { clientX, clientY };
        return;
      }

      nonUiState.computing = true;

      explain(clientX, clientY);
    });

    codemirrorEl.addEventListener("click", () => {
      elaborate(cm.getCursor("from"));
    });

    function elaborate(location) {
      if (state.compilation.state !== "success" || state.compilation.empty)
        return;
      worker.postMessage({
        type: ELABORATE,
        location,
      });
    }

    function explain(left, top) {
      const { compilation } = state;

      if (compilation.state !== "success") return;

      let { line, ch } = cm.coordsChar({ left, top }, "window");

      const lastLocation = nonUiState.lastLocation || {};

      if (line === lastLocation.line && ch === lastLocation.ch) {
        nonUiState.computing = false;
        return;
      }

      nonUiState.lastLocation = { line, ch };

      worker.postMessage({
        type: EXPLAIN,
        location: { line, ch },
      });
    }

    function onExplanation() {
      nonUiState.computing = false;
      if (nonUiState.next) {
        const { clientX, clientY } = nonUiState.next;
        nonUiState.next = null;
        explain(clientX, clientY);
      }
    }

    function computeExploration(exploration) {
      nonUiState.computedMarks = exploration.map(({ start, end }, i) => {
        return getMark({ start, end }, `computed-${i}`);
      });

      for (let i = nonUiState.lastRule + 1; i < exploration.length; i++) {
        styleSheet.insertRule(
          `.hover-${i} .computed-${i} { background: #eee8d5 }`,
          styleSheet.cssRules.length
        );
      }

      nonUiState.lastRule = Math.max(exploration.length, nonUiState.lastRule);

      nonUiState.hoverMark && nonUiState.hoverMark.clear();
    }

    const debouncedCompile = debounce(
      (source) =>
        worker.postMessage({
          type: COMPILE,
          source,
        }),
      128
    );

    function compileSession() {
      const code = cm.getValue();
      window.localStorage.setItem("code", code);

      if (code.trim() === "") {
        setState({ compilation: { state: "success", empty: true } });
      } else {
        debouncedCompile(cm.getValue());
      }

      const { computedMarks } = nonUiState;
      nonUiState.computedMarks = null;
      computedMarks &&
        requestAnimationFrame(() =>
          computedMarks.forEach((mark) => mark.clear())
        );
    }

    function renderHover() {
      const { hoverEl } = state.compilation;

      const klass =
        hoverEl &&
        [...hoverEl.classList].find((klass) => klass.startsWith("computed-"));
      const newIndex = klass && Number(klass.replace("computed-", ""));

      if (nonUiState.hoverIndex != null && newIndex !== nonUiState.hoverIndex) {
        removeClass(codemirrorEl, `hover-${nonUiState.hoverIndex}`);
      }

      if (newIndex != null) {
        addClass(codemirrorEl, `hover-${newIndex}`);
      }

      nonUiState.hoverIndex = newIndex;
    }

    /* EXPLANATION ASIDE */

    const explanationEl = querySelector(".explanation");
    const loadingContainer = explanationEl.querySelector(".loading");
    const loadedContainer = explanationEl.querySelector(".loaded");
    const itemContainer = explanationEl.querySelector(".item-container");
    const itemTitle = itemContainer.querySelector(".item-title");
    const itemEl = itemContainer.querySelector(".item");
    const errorMessageContainer = itemContainer.querySelector(
      ".error-message-container"
    );
    const errorMessageEl = itemContainer.querySelector(".error-message");
    const moreInfoHeader = explanationEl.querySelector(".more-info");
    const bookRow = moreInfoHeader.querySelector(".book-row");
    const bookLink = bookRow.querySelector("a");
    const keywordRow = moreInfoHeader.querySelector(".keyword-row");
    const keywordLink = keywordRow.querySelector("a");
    const infoWipEl = querySelector(".info-wip");
    const canBeBlockEl = querySelector(".can-be-block");

    const initialItem = itemEl.innerHTML;
    const initialItemTitle = itemTitle.innerHTML;
    const initialShowAll = showAllText.textContent;

    querySelector(".wrap-in-block").addEventListener("click", () => {
      const lines = cm.lineCount();
      for (let i = 0; i < lines; i++) {
        cm.indentLine(i, "add");
      }
      cm.replaceRange("fn main() {\n", { line: 0, ch: 0 });
      cm.replaceRange("\n}", {
        line: lines,
        ch: cm.getLineHandle(lines).text.length,
      });
    });

    function renderSessionState() {
      const { state: compilationState, error } = state.compilation;
      loadingContainer.style.display =
        compilationState === "pending" ? "initial" : "none";
      loadedContainer.style.display =
        compilationState !== "pending" ? "initial" : "none";

      if (compilationState === "error") {
        setHtml(itemTitle, "Oops! 💥");
        setHtml(itemEl, "There is a syntax error in your code:");

        setDisplay(errorMessageContainer, "block");
        setText(errorMessageEl, error.msg);

        setDisplay(canBeBlockEl, error.isBlock ? "block" : "none");

        nonUiState.errorMark = getMark(error, "compilation-error");
        nonUiState.errorContextMark = getMark(
          {
            start: {
              ...error.start,
              ch: 0,
            },
            end: {
              ...error.end,
              ch: cm.getLine(error.end.line).length,
            },
          },
          "compilation-error"
        );
      } else {
        nonUiState.errorMark && nonUiState.errorMark.clear();
        nonUiState.errorContextMark && nonUiState.errorContextMark.clear();
        setHtml(itemTitle, initialItemTitle);
        setHtml(itemEl, initialItem);
        setDisplay(errorMessageContainer, "none");
        setDisplay(canBeBlockEl, "none");
      }
    }

    function renderExplanation() {
      const location = state.compilation.explanation;
      nonUiState.hoverMark && nonUiState.hoverMark.clear();
      if (location == null || nonUiState.computedMarks != null) return;
      nonUiState.hoverMark = getMark(location);
    }

    function renderElaboration() {
      const { elaboration } = state.compilation;
      nonUiState.mark && nonUiState.mark.clear();
      nonUiState.hoverMark && nonUiState.hoverMark.clear();

      if (elaboration != null) {
        nonUiState.mark = getMark(elaboration.location);
        setHtml(itemTitle, elaboration.title);
        setHtml(itemEl, elaboration.elaboration);
        setDisplay(moreInfoHeader, "block");
        setDisplay(bookRow, elaboration.book ? "block" : "none");
        setDisplay(keywordRow, elaboration.keyword ? "block" : "none");
        bookLink.href = elaboration.book || "";
        keywordLink.href = elaboration.keyword || "";
        setDisplay(
          infoWipEl,
          elaboration.book || elaboration.keyword ? "none" : "initial"
        );
      } else {
        setHtml(itemTitle, initialItemTitle);
        setHtml(itemEl, initialItem);
        setDisplay(moreInfoHeader, "none");
      }
    }

    /* HELPERS */

    function getMark(location, className = "highlighted") {
      return cm.markText(location.start, location.end, {
        className,
      });
    }

    function debounce(fn, delay) {
      let enqueued = null;
      let lastArg = null;
      const wrapped = () => fn(lastArg);

      return (arg) => {
        lastArg = arg;
        if (enqueued != null) {
          window.clearTimeout(enqueued);
        }
        enqueued = setTimeout(wrapped, delay);
      };
    }

    function addClass(node, klass) {
      node.classList.add(klass);
    }

    function removeClass(node, klass) {
      node.classList.remove(klass);
    }

    function setText(node, text) {
      node.textContent = text;
    }

    function setHtml(node, html) {
      node.innerHTML = html;
    }

    function setDisplay(node, display) {
      node.style.display = display;
    }

    if (typeof __PRODUCTION__ != "boolean") {
      window.cm = cm;
      window.nonUiState = nonUiState;
    }
  }

  async function workerMain() {
    logInfo("workerMain");

    const state = {
      source: null,
      session: null,
      explanation: null,
      exploration: null,
    };

    self.onmessage = (e) => {
      const { data } = e;
      logInfo("Worker received", data.type);
      switch (data.type) {
        case LOAD:
          load(data.url, data.wasmUrl);
          break;
        case COMPILE:
          compile(data.source);
          break;
        case EXPLAIN:
          explain(data.location);
          break;
        case ELABORATE:
          elaborate(data.location);
          break;
        default:
          console.error("Unexpected message in worker", data);
      }
    };

    function load(url, wasmUrl) {
      self.importScripts(url);
      wasm_bindgen(wasmUrl).then(
        () => {
          postMessage({ type: READY });
        },
        (e) => console.error(e)
      );
    }

    function compile(source) {
      if (state.session) {
        state.session.free();
        state.session = null;
      }
      const result = wasm_bindgen.Session.new(source);
      const errorMsg = result.error_message();
      const location = result.error_location();

      const error =
        errorMsg != null
          ? {
              msg: errorMsg,
              start: {
                line: location[0] - 1,
                ch: location[1],
              },
              end: {
                line: location[2] - 1,
                ch: location[3],
              },
              isBlock: result.is_block(),
            }
          : null;

      state.session = result.session();
      state.error = error;
      notifySession();
      exploreLoop(state.session, true);
    }

    function notifySession() {
      postMessage({
        type: state.session != null ? COMPILED : COMPILATION_ERROR,
        error: state.error,
      });
    }

    function exploreLoop(session, init = false) {
      if (session != state.session || state.session == null) {
        return;
      }

      const LENGTH = 5;
      const DELAY = 16;

      if (init) {
        state.exploration = {
          buffer: new self.Uint32Array(LENGTH * 4),
          result: [],
        };
      }

      const { buffer } = state.exploration;
      const now = Date.now();
      const written = state.session.explore(buffer);

      for (let i = 0; i < written; i++) {
        state.exploration.result.push([
          [buffer[4 * i] - 1, buffer[4 * i + 1]],
          [buffer[4 * i + 2] - 1, buffer[4 * i + 3]],
        ]);
      }

      if (written < LENGTH) {
        logInfo("Exploration finished...");
        postMessage({
          type: EXPLORATION,
          exploration: state.exploration.result.map((range) => {
            const [start, end] = range;
            return {
              start: {
                line: start[0],
                ch: start[1],
              },
              end: {
                line: end[0],
                ch: end[1],
              },
            };
          }),
        });
        return;
      }

      setTimeout(() => exploreLoop(session), DELAY);
    }

    function explain(location) {
      doExplain(location);
      notifyExplanation();
    }

    function elaborate(location) {
      doExplain(location);
      notifyElaboration();
    }

    function doExplain(location) {
      if (state.explanation) {
        state.explanation.free();
        state.explanation = null;
      }

      state.explanation =
        state.session && state.session.explain(location.line + 1, location.ch);
    }

    function notifyExplanation() {
      postMessage({
        type: EXPLANATION,
        location: explanationLocation(state.explanation),
      });
    }

    function notifyElaboration() {
      postMessage({
        type: ELABORATION,
        location: explanationLocation(state.explanation),
        elaboration: state.explanation && state.explanation.elaborate(),
        title: state.explanation && state.explanation.title(),
        book: state.explanation && state.explanation.book(),
        keyword: state.explanation && state.explanation.keyword(),
      });
    }

    function explanationLocation(explanation) {
      return explanation != null
        ? {
            start: {
              line: explanation.start_line - 1,
              ch: explanation.start_column,
            },
            end: {
              line: explanation.end_line - 1,
              ch: explanation.end_column,
            },
          }
        : null;
    }
  }
})();
