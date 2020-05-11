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