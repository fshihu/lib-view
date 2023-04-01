export const AttachmentExt = {
    image: 'image',
    video: 'video',
    audio: 'audio',
    file: 'file',

    getType(name) {
        if (this.isImage(name)) {
            return this.image;
        } else if (this.isVideo(name)) {
            return this.video;
        } else if (this.isAudio(name)) {
            return this.audio;
        } else {
            return this.file;
        }
    },
    isImage(name) {
        let ext = this.getExt(name);
        return ext == 'png' || ext == 'jpg' || ext == 'bmp' || ext == 'gif' || ext == 'jpeg'
    },
    isVideo(name) {
        let ext = this.getExt(name);
        return ext == 'mp4';
    },
    isAudio(name) {
        let ext = this.getExt(name);
        return ext == 'mp3'||ext == 'amr';
    },
    getExt(name) {
        if (!name) {
            return '';
        }
        if(name.startsWith('data:image/')){
            let match = 'data:image/png;'.match(/^data:image\/(\w+);/);
            let ext = 'png';
            if(match && match[1]){
                ext = match[1];
            }
            return ext;
        }
        let split_name = name.split('.');
        let ext = split_name[split_name.length - 1];
        ext = ext.replace(/\?.*$/,'');
        return ext.toLowerCase();
    }

}