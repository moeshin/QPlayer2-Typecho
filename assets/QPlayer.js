if (!window.QPlayer) {
    window.QPlayer = {};
}
window.QPlayer.init = function () {

    if (document.getElementById('QPlayer')) {
        return;
    }

    $('body').append('<div id="QPlayer"><div id="QPlayer-body"><div id="QPlayer-panel"><div id="QPlayer-cover"><svg id="QPlayer-cover-default" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" style="fill:#222"/><circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="12" style="fill:#e12"/><circle cx="32" cy="32" r="1.2" style="fill:#fff"/></svg></div><div id="QPlayer-control"><div id="QPlayer-title"><strong id="QPlayer-name"></strong> -<span id="QPlayer-artist"></span></div><div id="QPlayer-progress"><div id="QPlayer-progress-current" style="width: 0;"></div></div><div id="QPlayer-control-bar"><div id="QPlayer-time">00:00</div><div id="QPlayer-control-play"><svg id="QPlayer-btn-previous" xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg><svg id="QPlayer-btn-next" xmlns="http://www.w3.org/2000/svg" viewBox="6 6 12 12"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg><div id="QPlayer-btn-play"><svg id="QPlayer-play" xmlns="http://www.w3.org/2000/svg" viewBox="16 10 22 28"><path d="M16 10v28l22-14z"/></svg><svg id="QPlayer-pause" xmlns="http://www.w3.org/2000/svg" viewBox="12 10 24 28"><path d="M12 38h8V10h-8v28zm16-28v28h8V10h-8z"/></svg></div></div><div id="QPlayer-control-more"><div id="QPlayer-btn-mode"><svg id="QPlayer-btn-repeat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg><svg id="QPlayer-btn-shuffle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg></div><svg id="QPlayer-btn-list" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M7 10h9V8H7v2zm0-7v2h9V3H7zm0 12h9v-2H7v2zm-4-5h2V8H3v2zm0-7v2h2V3H3zm0 12h2v-2H3v2z"/></svg><svg id="QPlayer-btn-lyrics" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M4 14v2h10v-2H4zm0-8v2h10V6H4zm-2 6h14v-2H2v2zM2 2v2h14V2H2z"/></svg></div></div></div></div><div id="QPlayer-switch"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></div></div><div id="QPlayer-more"><ol id="QPlayer-list"></ol><div id="QPlayer-lyrics"></div></div><audio id="QPlayer-audio"></audio></div>');

    var q = window.QPlayer;
    var v = {};

    var
        $q = $('#QPlayer'),
        $audio = $('#QPlayer-audio'),
        $cover = $('#QPlayer-cover'),
        $list = $('#QPlayer-list'),
        $title = $('#QPlayer-title'),
        $more = $('#QPlayer-more'),
        $time = $('#QPlayer-time'),
        $progress = $('#QPlayer-progress'),
        $progressCurrent = $('#QPlayer-progress-current'),
        $lyrics = $('#QPlayer-lyrics'),
        $mode = $('#QPlayer-btn-mode')
    ;

    var
        audio = $audio[0],
        coverTimeout = 500
    ;

    var $lyricsList, $listLi, isLoadPause, isPrevisionPlay, errorStartIndex, isAllError, setCoverTime;

    q.version = '2.0.6';
    q.audio = audio;
    q.defaultProvider = q.defaultProvider || 'default';
    q.provider = q.provider || {};
    q.provider.default = q.provider.default || {
        dataType: '*',
        lyrics: function (current, success) {
            var url = current.lrc;
            if (!url) {
                return;
            }
            var dataType = this.dataType;
            $.ajax({
                url: url,
                dataType: dataType,
                success: function (lrc) {
                    if (!lrc) {
                        return;
                    }
                    success(lrc);
                }
            });
        }
    };

    function Shuffle(index) {
        var _this = this;
        if (index === undefined) {
            this.index = -1;
            this.list = [];
        } else {
            this.index = 0;
            this.list = [index];
        }
        this.next = function () {
            if (this.index + 1 === this.list.length) {
                if (this.list.length >= v.list.length) {
                    this.index = 0;
                    return _this.list[0];
                }
                return push();
            }
            return this.list[++this.index];
        };
        this.previous = function () {
            if (this.index === 0) {
                var length = v.list.length;
                if (this.list.length === length) {
                    this.index = length - 1;
                    return this.list[this.index];
                }
                var index = getIndex();
                this.list.unshift(index);
                return index;
            }
            if (this.index === -1) {
                return push();
            }
            return this.list[--this.index];
        };
        function push() {
            var index = getIndex();
            _this.list.push(index);
            ++_this.index;
            return index;
        }
        function getIndex() {
            var length = v.list.length;
            if (_this.index === -1) {
                return random(length);
            }
            var list = [];
            for (var i = 0; i < length; ++i) {
                if (_this.list.includes(i)) {
                    continue;
                }
                list.push(i);
            }
            return list[random(list.length)];
        }
        function random(max) {
            return Math.floor(Math.random() * max);
        }
    }

    function getNextIndex() {
        if (v.list.length === 0) {
            return false;
        }
        if (q.isShuffle) {
            return q.shuffle.next();
        }
        if (++q.index === q.list.length) {
            q.index = 0;
        }
        return q.index;
    }

    function getPreviousIndex() {
        if (v.list.length === 0) {
            return false;
        }
        if (q.isShuffle) {
            return q.shuffle.previous();
        }
        if (--q.index < 0) {
            q.index = q.list.length - 1;
        }
        return q.index;
    }

    function onPlay() {
        $q.addClass('QPlayer-playing');
        $title.marquee('resume');
    }

    function onPause() {
        if (isLoadPause) {
            isLoadPause = false;
            return;
        }
        $q.removeClass('QPlayer-playing');
        $title.marquee('pause');
    }

    function s2m(s) {
        var m = Math.floor(s / 60);
        s = Math.floor(s % 60);
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return m + ':' + s;
    }

    function getListLi(index) {
        return $listLi.eq(index);
    }

    function Provider(provider, current) {
        var callbacks = new ProviderCallback();
        var isStop;
        this.call = function (name, success, error) {
            if (!error) {
                error = function () {}
            }
            var data = current[name];
            if (data) {
                success(data);
                return;
            }
            var callback = provider[name];
            if (callback === true) {
                callbacks.set(name, success, error);
                return;
            }
            if (callback) {
                callback(current, success, error);
                return;
            }
            error();
        };
        this.stop = function () {
            isStop = true;
        };
        this.load = function () {
            isStop = false;
            var load = provider.load;
            if (!load) {
                return;
            }
            load(current, callbacks);
        };

        function ProviderCallback() {
            var callbacks = {};
            var caches = {};
            this.success = function (name, data, cache) {
                var callback = callbacks[name];
                if (!callback) {
                    caches[name] = {
                        data: data,
                        cache: cache
                    };
                    return;
                }
                callback.success(data, cache);
            };
            this.error = function (name) {
                var callback = callbacks[name];
                if (!callback) {
                    caches[name] = false;
                    return;
                }
                callback.error();
            };
            this.set = function (name, success, error) {
                if (isStop) {
                    return;
                }
                var cache = caches[name];
                if (cache) {
                    success(cache.data, cache.cache);
                    return;
                }
                if (cache === false) {
                    error();
                    return;
                }
                callbacks[name] = {success: success, error: error};
            };
        }
    }

    function getProvider(current) {
        // noinspection JSUnresolvedVariable
        var providerName = current.provider || q.defaultProvider;
        if (typeof providerName === 'string') {
            var provider = q.provider[providerName];
            if (!provider) {
                console.warn('没有找到相应的 Provider：' + providerName);
                provider = {};
            }
            provider = current.provider = new Provider(provider, current);
            provider.name = providerName;
            return provider;
        }
        return providerName instanceof Provider ? providerName : new Provider({}, current);
    }

    function Lyrics(lrc) {
        this.time = [];
        this.text = [];
        this.index = -1;
        this.nextTime = 0;
        this.offset = 0;
        this.has = false;
        this.add = function (time, text) {
            var length = this.time.length;
            for (var i = 0; i < length; ++i) {
                var t = this.time[i];
                if (t < time) {
                    continue;
                }
                if (t === time) {
                    this.text[i] += '<br>' + text;
                    return;
                }
                if (i !== length - 1) {
                    this.time.splice(i, 0, time);
                    this.text.splice(i, 0, text);
                    return;
                }
            }
            this.time[length] = time;
            this.text[length] = text;
        };
        this.find = function (time) {
            var length = this.time.length;
            for (var i = 0; i < length; ++i) {
                var t = this.time[i] + this.offset;
                if (t < time) {
                    continue;
                }
                if (t === time) {
                    return i;
                }
                return i - 1;
            }
            return length - 1;
        };
        this.goto = function (index) {
            if (this.index !== -1) {
                $($lyricsList[this.index]).removeClass('QPlayer-lyrics-current');
            }
            this.nextTime = this.time[index + 1] + this.offset;
            this.index = index;
            if (index < 0) {
                return;
            }
            var $current = $($lyricsList[index]).addClass('QPlayer-lyrics-current');
            $lyrics.stop(true).animate({
                scrollTop: $current.offset().top - $lyrics.offset().top + $lyrics.scrollTop()
                    - (162 - $current.height()) / 2
            });
        };
        this.next = function (time) {
            if (isNaN(this.nextTime) || this.nextTime > time) {
                return;
            }
            this.goto(this.index + 1);
        };
        this.show = function () {
            var length = this.text.length;
            if (length === 0) {
                return;
            }
            var html = '';
            for (var i = 0; i < length; ++i) {
                html += '<p>' + this.text[i] + '</p>';
            }
            $lyrics.removeClass('QPlayer-lyrics-no');
            $lyrics.html(html);
            $lyricsList = $lyrics.children();
            this.goto(-1);
        };
        var linePattern = /^/mg;
        var timePattern = /\t*\[([0-6]?\d):([0-6]?\d)(?:\.(\d{1,3}))?]/g;
        var textPattern = /.*/mg;
        var offsetPattern = /^\[offset:\t*([+-]?\d+)]/mg;
        while ((linePattern.exec(lrc)) !== null) {
            var lineIndex = linePattern.lastIndex;
            var result;
            offsetPattern.lastIndex = lineIndex;
            if ((result = offsetPattern.exec(lrc)) != null) {
                linePattern.lastIndex = offsetPattern.lastIndex;
                this.offset = parseFloat(result[1]);
                continue;
            }
            var index = timePattern.lastIndex = lineIndex;
            var times = [];
            function isTime() {
                // noinspection JSReferencingMutableVariableFromClosure
                return (result = timePattern.exec(lrc)) != null && result.index === index;
            }
            if (!isTime()) {
                ++linePattern.lastIndex;
                continue;
            }
            do {
                linePattern.lastIndex = textPattern.lastIndex = timePattern.lastIndex;
                var time = parseInt(result[1]) * 60000 + parseInt(result[2]) * 1000;
                var f = result[3];
                if (f) {
                    var fLength = f.length;
                    time += parseInt(fLength < 3 ? f + '0'.repeat(3 - fLength) : f);
                }
                times.push(time);
                index = timePattern.lastIndex;
            } while (isTime());
            if (times.length === 0) {
                continue;
            }
            var text = textPattern.exec(lrc)[0].trim();
            var length = times.length;
            for (var i = 0; i < length; ++i) {
                this.add(times[i], text);
            }
        }
        this.has = this.time.length !== 0;
    }

    function errorWithIndex(index) {
        if (errorStartIndex === index) {
            isAllError = true;
            init();
            q.pause();
            return true;
        }
        if (errorStartIndex === -1) {
            errorStartIndex = index;
        }
        getListLi(index).addClass('QPlayer-list-error');
        return false;
    }

    function initCover() {
        setTimeout(function () {
            if (setCoverTime >= new Date().getTime() - coverTimeout) {
                return;
            }
            $cover.css('background-image', '');
            $cover.addClass('QPlayer-cover-no');
        }, coverTimeout);
    }

    function initLoad() {
        $lyrics.addClass('QPlayer-lyrics-no').html('<p>无歌词，请欣赏。</p>');
        $title.html('<strong>没有歌曲</strong>');
        $lyricsList = null;
        $progressCurrent.width('0');
        audio.currentTime = 0;
        initCover();
        $title.marquee('destroy');
    }

    function init() {
        q.index= -1;
        q.current = null;
        initLoad();
        isLoadPause = false;
        errorStartIndex = -1;
    }

    function initNoSongs() {
        init();
        $listLi = null;
        $list.html('<li class="QPlayer-list-current">没有歌曲</li>');
    }

    function isNeedMarquee() {
        var width = 0;
        // noinspection JSUnresolvedFunction
        $title.children().each(function () {
            width += $(this).width();
        });
        return width > $title.width();
    }

    function preloadCover(url) {
        var image = new Image();
        image.onload = function () {
            setCoverTime = new Date().getTime();
            $cover.css('background-image', 'url("' + url + '")');
            $cover.removeClass('QPlayer-cover-no');
        };
        image.src = url;
    }

    function anchorSongList($li) {
        $list.scrollTop($list.scrollTop() - $list.offset().top + $li.offset().top + 1);
    }

    function getArtist(artist) {
        return Array.isArray(artist) ? artist.join(' / ') : artist;
    }

    /**
     * 加载
     *
     * @param {Number} index
     * @return {boolean}
     */
    q.load = function(index) {
        isAllError = false;
        var current = q.current;
        if (current) {
            getProvider(current).stop();
            isLoadPause = true;
            audio.pause();
        }
        initLoad();
        var length = v.list.length;
        if (length === 0) {
            console.warn('list 为空！');
            return false;
        }
        if (!(length > index || index > 0)) {
            console.warn('超出 list，length=' + length + '，index=' + index);
            return false;
        }
        $list.children('.QPlayer-list-current').removeClass('QPlayer-list-current');
        var $li = getListLi(index).addClass('QPlayer-list-current');
        if (!current) {
            anchorSongList($li)
        }
        current = v.list[index];
        var title = '<strong>' + current.name + '</strong>';
        var artist = getArtist(current.artist);
        if (artist) {
            title += '<span> - ' + artist + '</span>';
        }
        $title.html(title);
        if (isNeedMarquee()) {
            $title.marquee({
                duration: 10000,
                gap: 40,
                delayBeforeStart: 1000,
                duplicated: true,
                startVisible: true
            }).marquee('pause');
        }
        q.index = index;
        q.current = current;
        var provider = getProvider(current);
        provider.call('cover', function (url, cache) {
            if (isAllError || !url) {
                return;
            }
            preloadCover(url);
            if (cache) {
                current.cover = url;
            }
        });
        provider.call('lyrics', function (lrc) {
            if (isAllError || !lrc) {
                return;
            }
            if (!(lrc instanceof Lyrics)) {
                current.lyrics = new Lyrics(lrc);
            }
            current.lyrics.show();
        });
        provider.load();
        return true;
    };

    /**
     * 播放
     *
     * @param index
     * @param isPrevious
     * @return {number}
     * 0 错误
     * 1 List 为空
     * 2 播放音频
     * 3 加载并播放音频
     * 4 全部错误无法播放
     */
    function play(index, isPrevious) {
        isPrevisionPlay = isPrevious;
        if (index === false) {
            console.warn('list 为空！');
            return 1;
        } else if (typeof index === 'number') {
            if (!q.load(index)) {
                return errorWithIndex(index) ? 4 : 0;
            }
        } else {
            index = q.index;
            if (audio.readyState !== 0) {
                onPlay();
                audioPlay();
                return 2;
            }
        }
        if (index === -1) {
            return 0;
        }

        onPlay();
        var current = q.current;
        function getIndex() {
            var list = v.list;
            return list[index] === current ? index : list.indexOf(current);
        }
        function error() {
            var _index = getIndex();
            if (_index === -1) {
                console.warn('未找到索引');
                return;
            }
            if (errorWithIndex(_index)) {
                return;
            }
            if (isPrevious) {
                q.previous();
            } else {
                q.next();
            }
        }
        function audioPlay() {
            function catchError(e) {
                if (e.name === 'AbortError') {
                    return;
                }
                error = true;
                console.error([e]);
            }
            var error = false;
            var promise = null;
            try {
                promise = audio.play();
                if (typeof Promise === 'function' && promise instanceof Promise) {
                    promise
                        .then(function () {
                            getListLi(getIndex()).removeClass('QPlayer-list-error');
                        })
                        .catch(catchError);
                }
            } catch (e) {
                catchError(e);
            }
            if (!error && !(typeof Promise === 'function' && promise instanceof Promise)) {
                getListLi(getIndex()).removeClass('QPlayer-list-error');
            }
        }
        getProvider(current).call('audio', function (url, cache) {
            if (isAllError) {
                return;
            }
            if (!url) {
                error();
                return;
            }
            if (cache) {
                current.audio = cache;
            }
            audio.src = url;
            audio.load();
            audioPlay();
        }, error);
        return 3;
    }

    q.play = function (index, isPrevious) {
        var bool = play(index, isPrevious);
        if (bool) {
            return bool;
        }
        return isPrevious ? q.previous() : q.next();
    };

    q.pause = function () {
        onPause();
        audio.pause();
    };

    q.next = function () {
        return q.play(getNextIndex());
    };

    q.previous = function () {
        return q.play(getPreviousIndex(), true);
    };

    q.reload = function () {
        q.pause();
        return q.load(q.index);
    }

    /**
     * @param {Object|String} options
     */
    q.setColor = function(options) {
        var jq = $('#QPlayer-theme');
        if (!jq.length) {
            jq = $('<style id="QPlayer-theme"></style>');
            $q.append(jq);
        }
        // noinspection JSDeprecatedSymbols
        var all = typeof options === 'string' ? options : options.all;
        if (!all) {
            jq.text('');
            return;
        }
        var color;
        var style = '';
        function getColor(name) {
            color = options[name];
            if (color === undefined) {
                color = all;
            }
        }
        getColor('switch');
        if (color) {
            style += '#QPlayer-switch{background:' + color + ';}';
        }
        getColor('progress');
        if (color) {
            style += '#QPlayer-progress-current{background:' + color + ';}';
        }
        getColor('list');
        if (color) {
            style += '#QPlayer-list li:hover, #QPlayer-list li.QPlayer-list-current{border-left-color:' + color + ';}';
        }
        getColor('lyrics');
        if (color) {
            style += '#QPlayer-lyrics.QPlayer-lyrics-no p,#QPlayer-lyrics p.QPlayer-lyrics-current{color:' + color + ';}';
        }
        jq.text(style);
    };

    $('#QPlayer-switch').click(function () {
        $q.toggleClass('QPlayer-show');
    });
    $('#QPlayer-btn-list').click(function () {
        var name = 'QPlayer-list-show';
        if ($more.hasClass(name)) {
            $more.removeClass(name);
        } else {
            var index = q.index;
            if (index !== -1) {
                anchorSongList(getListLi(index))
            }
            $more.addClass(name);
        }
    });
    $('#QPlayer-btn-lyrics').click(function () {
        $more.toggleClass('QPlayer-lyrics-show');
    });
    $('#QPlayer-btn-play').click(function () {
        if ($q.hasClass('QPlayer-playing')) {
            q.pause();
        } else {
            q.play();
        }
    });
    $('#QPlayer-btn-next').click(q.next);
    $('#QPlayer-btn-previous').click(q.previous);
    $cover.click(function () {
        q.isRotate = !v.isRotate;
    });
    $mode.click(function () {
        q.isShuffle = !v.isShuffle
    });
    $list.on('click', 'li:not(.QPlayer-list-current)', function () {
        var index = $(this).index();
        if (v.isShuffle) {
            q.shuffle = new Shuffle(index);
        }
        q.play(index);
    });
    $audio
        .on('playing', onPlay)
        .on('pause', onPause)
        .on('ended', q.next)
        .on('timeupdate', function () {
            var time = audio.currentTime;
            $time.text(s2m(time));
            var lyrics = q.current.lyrics;
            if (lyrics && lyrics.has) {
                lyrics.next(time * 1000);
            }
            if (!isProgressClicked) {
                $progressCurrent.width(100 * time / audio.duration + '%');
            }
        })
        .on('error', function () {
            console.log('error', arguments);
            var index = v.list.indexOf(q.current);
            if (index !== -1 && errorWithIndex(index)) {
                return;
            }
            if (isPrevisionPlay) {
                q.previous();
            } else {
                q.next();
            }
        })
        .on('canplay', function () {
            errorStartIndex = -1;
        })
    ;

    // 进度条操作
    var isProgressClicked;
    function getXFromEvent(e) {
        var type = e.type;
        switch (type) {
            case 'mousedown':
            case 'mouseup':
            case 'mousemove':
                return e.pageX;
            case 'touchstart':
            case 'touchmove':
            case 'touchend':
                return e.originalEvent.changedTouches[0].pageX;
        }
        return false;
    }
    function getProgressFromEvent(e) {
        return getXFromEvent(e) - $progress.offset().left;
    }
    function moveProgress(e) {
        if (!isProgressClicked) {
            return;
        }
        e.preventDefault();
        var total = $progress.width();
        var current = getProgressFromEvent(e);
        $progressCurrent.width(current < total ? current : total);
    }
    $progress.on('mousedown touchstart', function (e) {
        isProgressClicked = true;
        moveProgress(e);
    });
    $(document)
        .on('mouseup touchend', function (e) {
            if (!isProgressClicked) {
                return;
            }
            isProgressClicked = false;
            var duration = audio.duration;
            if (isNaN(duration)) {
                $progressCurrent.width(0);
                return;
            }
            var total = $progress.width();
            var current = getProgressFromEvent(e);
            if (current >= total) {
                q.next();
                return;
            }
            var time = current > 0 ? duration * current / total: 0;
            audio.currentTime = time;
            var lyrics = q.current.lyrics;
            if (lyrics && lyrics.has) {
                lyrics.goto(lyrics.find(time * 1000));
            }
        })
        .on('mousemove touchmove', moveProgress);

    initNoSongs();

    function getLocalStorageName(name) {
        return 'QPlayer-' + name;
    }

    function getBoolFromLocalStorage(name) {
        var value = localStorage.getItem(getLocalStorageName(name));
        return !!(value && value !== 'false');
    }

    function setBoolFromLocalStorage(name, value) {
        localStorage.setItem(getLocalStorageName(name), value);
    }

    function hasLocalStorageName(name) {
        return localStorage.hasOwnProperty(getLocalStorageName(name));
    }

    function defineProperties(obj, properties) {
        var keys = Object.keys(properties);
        var length = keys.length;
        for (var i1 = 0; i1 < length; ++i1) {
            var key1 = keys[i1];
            v[key1] = obj[key1];
        }
        Object.defineProperties(obj, properties);
        for (var i2 = 0; i2 < length; ++i2) {
            var key2 = keys[i2];
            if (properties[key2].type === 'bool' && hasLocalStorageName(key2)) {
                obj[key2] = getBoolFromLocalStorage(key2);
                continue;
            }
            obj[key2] = v[key2] || properties[key2].default;
        }
    }

    defineProperties(q,{
        isShuffle: {
            get: function () {
                return v.isShuffle;
            },
            set: function (value) {
                v.isShuffle = value;
                setBoolFromLocalStorage('isShuffle', value);
                if (value) {
                    $mode.addClass('QPlayer-shuffle');
                    var index = q.index;
                    q.shuffle = new Shuffle(index === -1 ? undefined : index);
                } else {
                    $mode.removeClass('QPlayer-shuffle');
                    q.shuffle = null;
                }
            },
            type: 'bool',
            default: false
        },
        isRotate: {
            get: function () {
                return v.isRotate;
            },
            set: function (value) {
                v.isRotate = value;
                setBoolFromLocalStorage('isRotate', value);
                if (value) {
                    $cover.addClass('QPlayer-cover-rotate');
                } else {
                    $cover.removeClass('QPlayer-cover-rotate');
                }
            },
            type: 'bool',
            default: true
        },
        list: {
            get: function () {
                return v.list;
            },
            set: function (value) {
                if (!Array.isArray(value)) {
                    console.warn('list 应该是数组');
                    return;
                }
                v.list = value;
                var length = value.length;
                if (length === 0) {
                    initNoSongs();
                    return;
                }
                var html = '';
                for (var i = 0; i < length; ++i) {
                    var item = value[i];
                    html += '<li><strong>' + item.name + '</strong>';
                    var artist = getArtist(item.artist);
                    if (artist) {
                        html += '<span>' + artist + '</span>';
                    }
                    html += '</li>';
                }
                q.pause();
                $list.html(html);
                $listLi = $list.children();
                if (q.index > -1 && q.current && length > q.index && value[q.index] === q.current) { // 已加载保持不变
                    return;
                }
                init();
                // noinspection JSCheckFunctionSignatures
                q.load(getNextIndex());
            },
            type: 'list',
            default: []
        }
    });
};

$(window.QPlayer.init);

