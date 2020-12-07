# SaaSquatch Json Schema Editor

## Installing via NPM

```
npm install @saasquatch/json-schema-editor-visual
```

## Getting Started

```js
import "antd/dist/antd.css";
import "@saasquatch/json-schema-editor-visual/dist/index.css";
import createEditor from "@saasquatch/json-schema-editor-visual";

const SchemaEditor = createEditor();

const SchemaEditorView = () => {
  return (
    <>
      <SchemaEditor />
    </>
  );
};
```

The schema editor is designed to be compatible with JSON Schema version draft-06. Visit the [JSON Schema Website](https://json-schema.org/) to learn more.

## Schema Editor Props

| name       | type     | default | description                                                    |
| ---------- | -------- | ------- | -------------------------------------------------------------- |
| `data`     | string   | null    | the data of editor                                             |
| `onChange` | function | null    | the function triggered when changes to the editor's data occur |

## Acknowledgements

Forked from [YMFE](https://github.com/YMFE/json-schema-editor-visual).