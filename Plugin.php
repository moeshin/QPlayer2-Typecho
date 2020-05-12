<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}
/**
 * 一款简洁小巧的 HTML5 底部悬浮音乐播放器
 *
 * @package QPlayer2
 * @author moeshin
 * @version 2.0.0
 * @link https://github.com/moeshin/QPlayer2-Typecho
 */
class QPlayer2_Plugin extends Typecho_Widget implements Typecho_Plugin_Interface
{
    /**
     * 激活插件方法,如果激活失败,直接抛出异常
     *
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
    public static function activate()
    {
        if (!extension_loaded('curl')) {
            throw new Typecho_Plugin_Exception(_t('缺少 cURL 拓展'));
        }
        if (!(extension_loaded('openssl') || extension_loaded('mcrypt'))) {
            throw new Typecho_Plugin_Exception(_t('缺少 openssl 或 mcrypt 拓展'));
        }
        Helper::addAction('QPlayer2', 'QPlayer2_Action');
    }

    /**
     * 禁用插件方法,如果禁用失败,直接抛出异常
     *
     * @static
     * @access public
     * @return void
     */
    public static function deactivate() {
        Helper::removeAction('QPlayer2');
    }

    /**
     * 获取插件配置面板
     *
     * @access public
     * @param Typecho_Widget_Helper_Form $form 配置面板
     * @return void
     */
    public static function config(Typecho_Widget_Helper_Form $form)
    {
        $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio(
            'jQuery',
            array(
                'true' => _t('是'),
                'false' => _t('否')
            ),
            'true',
            _t('加载 jQuery'),
            _t('若冲突，请关闭')
        ));
        $form->addInput(new Typecho_Widget_Helper_Form_Element_Text(
            'color',
            null,
            '#EE1122',
            _t('主题颜色'),
            _t('默认：<span style="color: #EE1122">#EE1122</span>')
        ));
        $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio(
            'isAutoplay',
            array(
                'true' => _t('是'),
                'false' => _t('否')
            ),
            'false',
            _t('是否自动播放')
        ));
        $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio(
            'isShuffle',
            array(
                'true' => _t('是'),
                'false' => _t('否')
            ),
            'true',
            _t('是否随机播放')
        ));
        $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio(
            'bitrate',
            array(
                '128' => _t('流畅品质 128K'),
                '192' => _t('清晰品质 192K'),
                '320' => _t('高品质 320K')
            ),
            '320',
            _t('默认音质')
        ));
        $form->addInput(new Typecho_Widget_Helper_Form_Element_Textarea(
            'list',
            null,
            '[{
    "name": "Nightglow",
    "artist": "蔡健雅",
    "audio": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/Nightglow.mp3",
    "cover": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/Nightglow.jpg",
    "lrc": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/Nightglow.lrc"
},
{
    "name": "やわらかな光",
    "artist": "やまだ豊",
    "audio": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/やわらかな光.mp3",
    "cover": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/やわらかな光.jpg"
}]',
            _t('歌曲列表'),
            _t('JSON 格式的数组，具体属性请看 <a href="https://github.com/moeshin/QPlayer2#list-item">这里</a><br>您也可以添加：<br><code>{"server": "netease", "type": "playlist"， "id": "3136952023"}</code><br>来引入第三方资源<br><code>server</code>：netease、tencent、baidu、xiami、kugou<br><code>type</code>：playlist、song、album、artist')
        ));
        $form->addInput(new Typecho_Widget_Helper_Form_Element_Textarea(
            'cookie',
            null,
            '',
            _t('网易云音乐 Cookie'),
            _t('如果您是网易云音乐的会员，可以将您的 cookie 填入此处来获取云盘等付费资源，听歌将不会计入下载次数。<br><strong>如果不知道这是什么意思，忽略即可。</strong>')
        ));
    }

    /**
     * 个人用户的配置面板
     *
     * @access public
     * @param Typecho_Widget_Helper_Form $form
     * @return void
     */
    public static function personalConfig(Typecho_Widget_Helper_Form $form) {}
}