class ImagesLayout {
    constructor(iamges, containerWidth, numberInLine = 10, limit = 0, stdRatio = 1.5) {
        // 图片列表
        this.images = images;

        // 布局完毕的图片列表
        this.completedImages = [];

        // 容器宽度
        this.containerWidth = containerWidth;

        // 单行显示的图片数量
        this.numberInLine = numberInLine;

        // 限制布局的数量，默认为0，不限制，即对传入的所有图片进行布局
        this.limit = limit;

        // 图片标准宽高比
        this.stdRatio =  stdRatio;

        // 图片撑满整行时的标准高度
        this.stdHeight = this.containerWidth / this.stdRatio;

        this.chunkAndLayout();

    }
    
    // 将图片列表根据单行数量分块并开始计算布局
    chunkAndLayout() {
        // 当突图片只有一张时，完整显示这张图片
        if (this.images.length === 1) {
            this.layoutFullImage(this.images[0]);

            return;
        }

        let temp = [];
        for(let i = 0; i < this.images.length; i ++) {
            if (this.limit && i >= this.limit) return;

            temp.push(this.images[i]);

            if (i % this.numberInLine === this.numberInLine - 1 || i === this.images.length - 1 || i === this.limit - 1) {
                this.computedImagesLayout(temp);

                temp = [];
            }
        }
    }

    layoutFullImage(image) {
        let ratio = image.width / image.height;

        image.width = this.containerWidth;
        image.height = parseInt(this.containerWidth / ratio);

        this.completedImages.push(image);
    }
    
    // 根据分块计算图片的布局信息
    computedImagesLayout(images) {
        if (images.length === 1) {
            // 当前分组只有一张图片
            this.layoutWithSingleImage(images[0]);
        } else {
            // 当前分组有多张图片时
            this.layoutWithMultipleImages(images);
        }

    }

    layoutWithSingleImage(image) {
        let ratio = image.width / image.height;

        image.width = this.containerWidth;

        if(ratio < this.stdRatio) {
            image.height = parseInt(this.stdHeight);
        } else {
            image.height = parseInt(this.containerWidth / ratio);
        }
        this.completedImages.push(image)
        
    }
    layoutWithMultipleImages(images) {
        let widths = [];
        let ratios = [];
        images.forEach(item => {
            // 计算每张图片的宽高比
            let ratio = item.width / item.height;

            // 根据标准高度计算宽度
            let relateWidth = this.stdHeight * ratio;
            widths.push(relateWidth);
            ratios.push(ratio);

        });

        // 根据标准宽度计算相对宽度的总和
        let totalWidth = widths.reduce( (sum, item ) => sum + item, 0);
        let lineHeight = 0;
        let leftWidth = this.containerWidth;

        images.forEach((item, i) => {
            if( i === 0 ) {
                // 第一张图片
                item.width = parseInt(this.containerWidth * (widths[i] / totalWidth));
                item.height = lineHeight = parseInt(item.width / ratios[i]);

                leftWidth = leftWidth - item.width;
            } else if ( i === images.length - 1) {
                // 最后一张图片
                item.width = leftWidth;
                item.height = lineHeight;
            } else {
                // 中间的图片
                item.height = lineHeight;
                item.width = parseInt(item.height * ratios[i]);

                leftWidth = leftWidth - item.width;
            }

            this.completedImages.push(item);
        });
    }


}