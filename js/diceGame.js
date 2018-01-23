$(function () {
    var count = 0,
        gameInfo = {
            gameNo: 'GAdPNDEKPk',
        },
        adInfo = {},
        baseUrl = '//apneo.cn/tuia/api',
        _pathSearch = location.search,
        _ruleBtn = $('.index_rule'),
        _Shade = $('.diceShade'),
        _ruleInfo = $('.diceRule'),
        _ruleClose = $('.rule_close'),
        _gameBtn = $('.index_btn '),
        _gameBtnImg = $('.dice_btn'),
        _diceImg = $('#dice .dice'),
        _winInfo = $('.winInfo'),
        _winClose = $('.win_close'),
        _gameChance = $('.game_chance'),
        _gameClose = $('.game_close'),
        _moreGame = $('.more_game'),
        _winAdvert = $('.win_advert'),
        _winBtn = $('.win_btn');
        var sUserAgent = navigator.userAgent;
        var isAndroid = sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Adr') > -1;
        var pathArr = location.pathname.split('/');
        var hName = pathArr[pathArr.length - 1].split('.')[0];
    //游戏次数
    $.ajax({
        url: baseUrl + '/stat/pv' + _pathSearch,
        type: 'get',
        dataType: 'json',
        data: {
            type: '6',
            val: gameInfo.gameNo
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (res) {
            console.log(res);
            count = res;
            $('.count').html(count);
        }
    });
    //游戏点击
    var pvCount = function (type, val) {
        $.ajax({
            url: baseUrl + '/stat/pv' + _pathSearch,
            type: 'get',
            data: {
                type: type,
                val: val
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (res) {
                console.log(res);
            }
        })
    }
    //广告
    var getAdvert = function () {
        $.ajax({
            url: baseUrl + '/ad/get' + _pathSearch,
            type: 'get',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (res) {
                console.log(res);
                if (res.totalNums == 0) {
                    $('.win_btn').html('笑纳了');
                    $('.win_advert').attr('src', '//apmou.cn/test/img/luckyad.jpg');
                    $('win_tel').html('恭喜您获得');
                    $('win_text').html('幸运上上签:今天大吉大利');
                } else {
                    adInfo = res.ads[0];
                    $('.win_btn').html('立即领取');
                    $('.win_advert').attr('src', '//apmou.cn/tuia/img/' + adInfo.adNo + '.jpg');
                    $('.win_text').html(adInfo.adDesc);
                    pvCount('4', adInfo.adNo);
                }
            }
        })
    }
    //更多游戏
    var moreGameInfo = function () {
        $.ajax({
            url: baseUrl + '/game/list' + _pathSearch,
            type: 'get',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (res) {
                console.log(res);
                if (res.totalNums > 0) {
                    $('.more_game').children('.flag').remove();
                    var data = res.game;
                    for (var i = 0; i < data.length; i++) {
                        $('.game_footer').before('<img src="//apmou.cn/tuia/img/' + data[i].gameNo + '.png" class="otherGameList flag" data-url="//apmou.cn/tuia/' + data[i].gameNo + '.html">');
                    }
                }
            },
            error: function (xhr, error) {}
        })
    }
    //点击量计算
    var cnzz = function () {
        var thisPath = $(this).attr('src').split('/');
        var imgName = thisPath[thisPath.length - 1];
        _czc.push(["_trackEvent", hName, "click", imgName, "", '']);
    }
    //点击广告跳转
    var clickAdvert = function () {
        if (!adInfo.adNo) {
            hidden();
        } else {
            pvCount('5', adInfo.adNo);
            // adInfo.adType==1?location.href=adInfo.apkUrl:location.href=adInfo.landpageUrl;
            location.href = adInfo.apkUrl;
            setTimeout(function () {
                location.href = adInfo.landpageUrl;
            }, 1500);
        }
    }
    //隐藏盒子
    function hidden() {
        _Shade.hide();
        _winInfo.hide();
        _gameBtnImg.attr({
            'src': '//apmou.cn/test/img/index_btn.png'
        });
        _diceImg.css('animation-play-state', 'running');
        _diceImg.removeClass("dice_" + num).addClass('dice_1');
        _gameBtnImg.css('animation-play-state', 'running');
    }
    // 点击显示游戏规则
    _ruleBtn.on('tap', function () {
        _Shade.fadeIn();
        _ruleInfo.fadeIn();
    });
    //点击关闭规则信息
    _ruleClose.on('tap', function () {
        _ruleInfo.hide();
        _Shade.hide();
    });
    //点击开始游戏
    _gameBtnImg.on('tap', function () {
        var src = '';
        num = Math.floor(Math.random() * 6 + 1);
        $(this).attr("disabled", "disabled");
        _gameBtnImg.css('animation-play-state', 'paused');
        _diceImg.css('animation-play-state', 'paused');
        _gameBtnImg.attr({
            'src': '//apmou.cn/test/img/index_btn2.png'
        });
        cnzz.apply($(this));
        if (count == 0) {
            moreGameInfo();
            _Shade.fadeIn();
            _moreGame.fadeIn();
            return false;
        } else {
            _diceImg.animate({
                left: '+2px'
            }, 100, function () {
                _diceImg.addClass("dice_t");
            }).delay(200).animate({
                top: '-2px'
            }, 100, function () {
                _diceImg.removeClass("dice_t").addClass("dice_s");
            }).delay(200).animate({
                opacity: 'show'
            }, 600, function () {
                _diceImg.removeClass("dice_s").addClass("dice_e");
            }).delay(100).animate({
                left: '-2px',
                top: '+2px'
            }, 100, function () {
                _diceImg.removeClass("dice_e").addClass("dice_" + num);
                src = $(".dice_" + num).css('background');
                getAdvert();
                _Shade.fadeIn();
                _winInfo.fadeIn();
                $('.win_num').css({
                    background: src
                });
            })
        }
        count--;
        $('.count').html(count);
        pvCount('3', gameInfo.gameNo);
    });
    //点击关闭中奖信息
    _winClose.on('click', function () {
        hidden();
        cnzz.apply($(this));
    });
    //中奖页广告信息
    _winAdvert.on('tap', function () {
        cnzz.apply($(this));
        clickAdvert ();
    });
    //中奖页按钮点击
    _winBtn.on('tap', function () {
        _czc.push(["_trackEvent",hName, "click", "winnBut", "", ""]);
        clickAdvert ();
    });
    //关闭更多游戏
    _gameClose.on('tap', function () {
        cnzz.apply($(this));
        _Shade.hide();
        _moreGame.hide();
        _gameBtnImg.attr({
            'src': '//apmou.cn/test/img/index_btn.png'
        });
        _diceImg.css('animation-play-state', 'running');
        _diceImg.removeClass("dice_" + num).addClass('dice_1');
        _gameBtnImg.css('animation-play-state', 'running');
    });
    //点击更多游戏跳转
    _moreGame.on('tap', '.flag', function () {
        location.href = $(this).data('url') + _pathSearch;
    });
    //游戏展现
    $(function () {
        pvCount('2', gameInfo.gameNo);
    })
});