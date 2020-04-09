use crate::{HelpItem, IntersectionVisitor};
use proc_macro2::LineColumn;
use serde_json;
use std::borrow::Cow;

pub fn test_example(source: &str) {
    let lines: Vec<_> = source.lines().collect();
    let separator = lines
        .iter()
        .enumerate()
        .find(|(_, l)| **l == "---")
        .expect("separator")
        .0;

    let mut item: Option<HelpItem> = None;
    let mut span = None;

    for line in &lines[0..separator] {
        if line.starts_with("span:") {
            let span_components: Vec<_> = line[("span:".len())..].trim().split("=>").collect();
            assert_eq!(span_components.len(), 2);
            let start: [usize; 2] =
                serde_json::from_str(span_components[0].trim()).expect("span format");
            let end: [usize; 2] =
                serde_json::from_str(span_components[1].trim()).expect("span format");
            span = Some((
                LineColumn {
                    line: start[0] + 1,
                    column: start[1],
                },
                LineColumn {
                    line: end[0] + 1,
                    column: end[1],
                },
            ));
            continue;
        }
        if line.starts_with("item:") {
            let item_line = &line[("item:".len())..].trim();
            let variant = item_line.split(" ").next().expect("variant first element");
            let data_line = format!("{{{}}}", &item_line[variant.len()..].trim());
            let mut help_data: serde_json::value::Map<_, _> =
                serde_json::from_str(&data_line).expect("valid JSON");
            help_data.insert("type".to_string(), variant.into());
            let help_item: HelpItem =
                serde_json::from_value(help_data.into()).expect("item parsing");
            item = Some(help_item);
            continue;
        }
        panic!("Unknown directive {:?}", line);
    }

    let item = item.expect("missing item");
    let span = span.expect("missing span");

    let mut source_lines = { lines }
        .split_at(separator + 1)
        .1
        .iter()
        .map(|l| Cow::Borrowed::<'_, str>(l))
        .collect::<Vec<_>>();

    let mut cursors = source_lines
        .iter()
        .enumerate()
        .flat_map(|(ln, l)| l.match_indices("<|>").map(move |m| (ln, m)))
        .collect::<Vec<_>>();

    assert_eq!(cursors.len(), 1);
    let (line, (column, _)) = cursors.pop().unwrap();

    source_lines[line]
        .to_mut()
        .replace_range(column..(column + 3), "");

    source_lines.insert(0, "fn __main() {".into());
    source_lines.push("}".into());

    let test_source = source_lines.join("\n");
    let file = syn::parse_file(&test_source).expect("invalid source");
    let visitor = IntersectionVisitor::new(LineColumn {
        line: line + 2,
        column,
    });

    let result = visitor.visit(&file);

    assert_eq!(item, result.help);
    assert_eq!(span, result.item_location);
}
