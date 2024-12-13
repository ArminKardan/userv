import dynamic from 'next/dynamic'
// import * as ts from "typescript";
import Component, { PageEl } from '../Component';
import ReplacePro from '../ReplacePro';
import Copy from '../Copy';


let AceEditor: any = (p) => null
export default p => Component(p, Page);
const Page: PageEl = (props, refresh, getProps, dies, z): React.JSX.Element => {

  if (props.functions) {
    props.functions.save = async () => {
      await save()
    }
  }

  if (props.lastrefresh != props.lastrefresh && props.editor) {
    props.lastrefresh = props.lastrefresh;
    props.editor.value = props.inittxt;
    props.code = props.inittxt;
    refresh();
  }

  const save = async () => {
    props.onsave?.(props.code)
    setTimeout(() => {
      global.success(z.lang.savedsuccess)
    }, 400);
  }

  const handleKeyDown = async (event) => {

    if (event.ctrlKey && event.keyCode === 88) { //ctrl+x
      const cursorPos = props.editor.getCursorPosition();
      Copy(props.editor.session.getLine(cursorPos.row))
      const value = props.editor.getValue();
      const lines = value.split("\n");
      const newLines = lines.slice(0, cursorPos.row).concat(lines.slice(cursorPos.row + 1));
      const newValue = newLines.join("\n");
      props.editor.setValue(newValue, -1);
      props.editor.gotoLine(cursorPos.row + 1, 0);
    }

    else if (event.ctrlKey && event.keyCode === 83) {
      event.preventDefault();
      await save();
    }
  }


  getProps(async () => {
    const allcompletors = Object.keys(props.Completer || {}).map(k => { return { w: k, c: props.Completer[k].c } })
    props.completer = {
      getCompletions: (editor, session, pos, prefix, callback) => {


        let funcs2 = Object.keys(props.Completer || {}).map((keyword) => {
          return {
            caption: keyword,
            value: keyword,
            meta: "funtion",
            score: 10,
            completer: {
              insertMatch: function (editor, data) {
                const cursorPos = editor.getCursorPosition();
                const lineStart = editor.session.getLine(cursorPos.row).match(/^\s*/)[0].length;

                editor.session.replace(
                  {
                    start: { row: cursorPos.row, column: lineStart },
                    end: cursorPos,
                  },
                  `${data.value}${props.Completer?.[data.value]?.s}`
                );
              },
            },
          };
        });

        callback(null, [...funcs2]);
      }
    };


    if (!props.AceEditorLoaded) {
      props.AceEditorLoaded = true;

      const uu =  async () => {
        const ace = await import('react-ace');
        await import('ace-builds/src-noconflict/ace');
        await import('ace-builds/src-noconflict/ext-language_tools');
        await import('ace-builds/src-noconflict/ext-emmet');
        await import('ace-builds/src-noconflict/ext-beautify');
        let mode = await import('./Mode.js')
        mode.Runner(allcompletors)
        await import('./Theme.js');
        return ace;
      }

      AceEditor = dynamic(
       uu as any,
        { ssr: false }
      );
    }


    window.addEventListener('keydown', handleKeyDown);
    props.code = props.inittxt || ""
  });


  return <div>

    <div onMouseDown={() => {

      global.setScroller("");
      setTimeout(() => {
        global.isDown = false;
      }, 100);
    }}
      onMouseUp={() => {
        global.setScroller("wind");
        setTimeout(() => {
          global.isDown = false;
        }, 100);
      }}
    >
      <AceEditor
        mode="typescript"
        theme="tomorrow_night"
        name="my-editor"
        markers={props.markers ? [props.markers] : null} // set the markers prop
        editorProps={{ $blockScrolling: true }}
        onChange={(value) => {
          props.onchange?.(value);
          setTimeout(() => {
            let els = document.getElementsByClassName("ace_autocomplete");
            if (els.length > 0) {
              (els[0] as HTMLElement).style.width = "min(1024px, 100%)"
            }

            if (props.markers?.className) {
              props.markers = {
                startRow: props.markers.startRow,
                startCol: props.markers.startCol,
                endRow: props.markers.endRow,
                endCol: props.markers.endCol,
                className: null,
                type: 'fullLine'
              }
              refresh()
            }
          }, 50)


          props.code = value
        }}
        value={props.code}
        width="100%"
        height={typeof props.height == "string" ? props.height : (typeof props.height == "number" ? (props.height + "px") : "450px")}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          showLineNumbers: true,
          enableSnippets: true,
          tabSize: 2
        }}
        fontSize={16}
        onLoad={(editor) => {
          props.editor = editor
          // const langTools = ace.require('ace/ext/language_tools');
          editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            enableSnippets: true,
            tabSize: 2,
            fontSize: "14px"
          });

          editor.completers.push(props.completer)

          refresh()
        }}
      />
    </div>
    {props.error ? <div style={{ backgroundColor: "black", height: 50, width: "100%", padding: 10, overflow: "scroll" }}>
      <p style={{ color: "#e63737", direction: "ltr" }}>
        {ReplacePro(props.error, "\n", <br />)}
      </p>
    </div> : null}

    <br-x />

  </div>
}