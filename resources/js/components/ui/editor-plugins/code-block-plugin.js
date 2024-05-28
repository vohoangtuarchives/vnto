


export default class CodeBlockPlugin extends Plugin {
  static get pluginName() {
    return 'CodeBlockPlugin';
  }

  init() {
    const editor = this.editor;

    // Thêm nút "Chèn mã" vào thanh công cụ
    editor.ui.componentFactory.add('codeBlockButton', {
      type: 'Button',
      label: 'Chèn mã',
      onAction: () => {
        // Chèn khối mã vào nội dung
       // editor.execute(InsertBlockCommand, { type: 'code' });
      },
    });
  }
}