use std::fs;

mod runtime;

macro_rules! case {
    ($name:ident) => {
        #[test]
        fn $name() {
            let source =
                fs::read_to_string(&format!("src/tests/fixtures/{}.rs", stringify!($name)))
                    .expect("no file");
            runtime::test_example(&source);
        }
    };
}

case![unit];
case![tuple_struct_pat];
