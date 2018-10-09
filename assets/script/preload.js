// 图片预加载
(function($){

    function PreLoad(imgs, options) {
        this.imgs = (typeof imgs === "string") ? [imgs] : imgs;
        this.opts = $.extend({}, PreLoad.DEFAULTS, options);   // 合并对象

        if(this.opts.ordered == "ordered"){
            // 有序加载
            this._ordered();
        }else{
            // 无序加载
            this._unordered();
        }
    }

    PreLoad.DEFAULTS = {
        ordered: "unordered", // 默认为无需预加载
        each: null, // 每一张图片 加载完毕后执行
        all: null // 所有图片预加载完毕后执行
    }

    PreLoad.prototype._ordered = function() {
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;

        load();

        function load() {
            var imgObj = new Image();

            $(imgObj).on("load error",function () {
                
                opts.each && opts.each(count)
                
                if (count >= len -1) {
                    opts.all && opts.all();
                }else {
                    load();
                }

                count++;
            });
            imgObj.src = imgs[count].url;
        }
    }
    
    // 无序加载
    PreLoad.prototype._unordered = function() {
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;
        $.each(imgs, function (i, item) {

            if(typeof item.url != "string"){
                return;
            }
            var imgObj = new Image();
            $(imgObj).on("load error", function(){
                
                opts.each && opts.each(count);

                if(count >= len -1){
                   opts.all && opts.all();
                }

                count++;
            })

            imgObj.src = item.url;
        });
    };

    $.extend({
        preload: function (imgs, opts) {
            new PreLoad(imgs, opts);
        }
    })
})(jQuery)