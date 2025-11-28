import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { java } from "@codemirror/lang-java";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete";

export default function JavaEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  // Initialize the editor
  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const state = EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          oneDark,
          java(),
          autocompletion({
            activateOnTyping: true,
            override: [
              // Add common Java keywords and methods
              (context) => {
                const word = context.matchBefore(/\w*/);
                if (!word || (word.from === word.to && !context.explicit))
                  return null;
                return {
                  from: word.from,
                  options: [
                    // Common Java keywords
                    { label: "public", type: "keyword" },
                    { label: "private", type: "keyword" },
                    { label: "protected", type: "keyword" },
                    { label: "static", type: "keyword" },
                    { label: "final", type: "keyword" },
                    { label: "void", type: "keyword" },
                    { label: "class", type: "keyword" },
                    { label: "interface", type: "keyword" },
                    { label: "extends", type: "keyword" },
                    { label: "implements", type: "keyword" },
                    { label: "return", type: "keyword" },
                    { label: "if", type: "keyword" },
                    { label: "else", type: "keyword" },
                    { label: "for", type: "keyword" },
                    { label: "while", type: "keyword" },
                    { label: "switch", type: "keyword" },
                    { label: "case", type: "keyword" },
                    { label: "break", type: "keyword" },
                    { label: "continue", type: "keyword" },
                    { label: "new", type: "keyword" },
                    { label: "this", type: "keyword" },
                    { label: "super", type: "keyword" },
                    { label: "try", type: "keyword" },
                    { label: "catch", type: "keyword" },
                    { label: "finally", type: "keyword" },
                    { label: "throw", type: "keyword" },
                    { label: "throws", type: "keyword" },
                    // Common types
                    { label: "String", type: "type" },
                    { label: "int", type: "type" },
                    { label: "double", type: "type" },
                    { label: "float", type: "type" },
                    { label: "boolean", type: "type" },
                    { label: "char", type: "type" },
                    { label: "long", type: "type" },
                    { label: "byte", type: "type" },
                    { label: "short", type: "type" },
                    { label: "Integer", type: "type" },
                    { label: "Double", type: "type" },
                    { label: "Boolean", type: "type" },
                    { label: "Character", type: "type" },
                    { label: "Long", type: "type" },
                    { label: "Float", type: "type" },
                    { label: "ArrayList", type: "type" },
                    { label: "HashMap", type: "type" },
                    { label: "HashSet", type: "type" },
                    { label: "List", type: "type" },
                    { label: "Map", type: "type" },
                    { label: "Set", type: "type" },
                    // Common methods
                    { label: "System.out.println()", type: "method" },
                    { label: "System.out.print()", type: "method" },
                    { label: "length()", type: "method" },
                    { label: "equals()", type: "method" },
                    { label: "toString()", type: "method" },
                    { label: "substring()", type: "method" },
                    { label: "charAt()", type: "method" },
                    { label: "indexOf()", type: "method" },
                    { label: "toLowerCase()", type: "method" },
                    { label: "toUpperCase()", type: "method" },
                    { label: "trim()", type: "method" },
                    { label: "split()", type: "method" },
                    { label: "replace()", type: "method" },
                    { label: "add()", type: "method" },
                    { label: "remove()", type: "method" },
                    { label: "get()", type: "method" },
                    { label: "put()", type: "method" },
                    { label: "contains()", type: "method" },
                    { label: "size()", type: "method" },
                    { label: "isEmpty()", type: "method" },
                    { label: "clear()", type: "method" },
                  ],
                };
              },
            ],
          }),
          keymap.of([indentWithTab, ...defaultKeymap]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const doc = update.state.doc.toString();
              onChange(doc);
            }
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      viewRef.current = view;

      // Cleanup on unmount
      return () => {
        view.destroy();
        viewRef.current = null;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronize external value changes with the editor
  useEffect(() => {
    if (viewRef.current) {
      const currentDoc = viewRef.current.state.doc.toString();
      if (value !== currentDoc) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: value },
        });
      }
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      style={{
        border: "1px solid #334155", // Adjusted border for the new theme
        borderRadius: "0.375rem", // 6px
        overflow: "hidden", // Ensures the theme's background respects the border radius
      }}
    />
  );
}
