<template>
    <Editor
        api-key="am1zxoprwulg1iqyxgyka8kuuisz224rdl7010qa95kjv9sq"
        :init="editorInitSettings"
        v-model="editorData"
        />
    <FileManager
        :open="fileMangerOpen"
        @close="fileMangerOpen=false"
        :multy="false"
        @file="insertToEditor"/>
</template>
<script>
    import Editor from '@tinymce/tinymce-vue';
    import {getTinymce} from '@tinymce/tinymce-vue/lib/cjs/main/ts/TinyMCE';
    import FileManager from '@/components/ui/file-manager';
    import { numeric } from '@vuelidate/validators';
    export default {
        components: {
            FileManager,
            Editor
        },
        props: {
            modelValue: {},
            height:{
                type:numeric
            }
        },
        watch: {
            editorData(newValue, oldValue) {
                if (newValue !== oldValue) {
                    this.$emit('update:modelValue', newValue);
                }
            }
        },
        methods: {
            isImage: function (mimeType) {
                var pattern = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff|image\/webp)$/;
                return pattern.test(mimeType);
            },
            insertToEditor(x) {
                if (x.length == 1) {
                    this.callback(x[0].path);
                } else {
                    x.map(function (i) {
                        let img = new Image();
                        img.src = i.path;
                        img.onload = () => {
                            getTinymce()
                                .activeEditor
                                .setContent(
                                    `<p><img src="${img.src}" alt="" width="${img.width}" height="${img.height}"></p>`
                                );
                        }
                    })
                }
            }
        },
        data() {
            return {
                callback: null,
                fileMangerOpen: false,
                editorData: this.modelValue,
                editorInitSettings: {
                    height: this.height??500,
                    schema: 'html5',
                    menubar: true,
                    branding: false,
                    plugins: 'preview   importcss tinydrive searchreplace autolink autosave save directional' +
                            'ity  visualblocks visualchars fullscreen image link media  codesample table ch' +
                            'armap pagebreak nonbreaking anchor  insertdatetime advlist lists  wordcount   ' +
                            ' help    charmap  quickbars linkchecker emoticons       ',
                    toolbar: 'undo redo  | aidialog aishortcuts | blocks fontsizeinput | bold italic | align' +
                            ' numlist bullist | link image | table media  | lineheight  outdent indent | st' +
                            'rikethrough forecolor backcolor  removeformat | charmap emoticons checklist | ' +
                            'code fullscreen preview | save print | pagebreak anchor codesample   | addtemp' +
                            'late inserttemplate | addcomment showcomments | ltr rtl  | spellcheckdialog  f' +
                            'ullscreenm',
                    setup: (editor) => {
                        editor
                            .ui
                            .registry
                            .addMenuButton('mybutton', {
                                text: 'My button',
                                fetch: (callback) => {
                                    callback();
                                }
                            });
                    },
                    image_uploadtab: false,
                    image_advtab: true,
                    file_picker_callback: (callback) => {
                        this.fileMangerOpen = true;
                        this.callback = callback;
                    }
                }
            };
        }
    };
</script>