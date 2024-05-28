
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

class MyCustomPlugin extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'myCustomPlugin', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Insert image',
                icon: imageIcon,
                tooltip: true
            } );

            view.on( 'execute', () => {
                console.log('dispatch some event');
            } );

            return view;
        } );
    }
}

export default MyCustomPlugin;