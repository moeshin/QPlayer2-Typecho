<?php

if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

include_once 'libs/cache/Cache.php';

use QPlayer\Cache\Cache;

class QPlayer2_Action extends Typecho_Widget implements Widget_Interface_Do
{
    /**
     * @throws Exception
     */
    public function action()
    {
        $request = $this->request;

        $do = $request->get('do');
        if ($do == 'flush') {
            $plugin = Typecho_Widget::widget('Widget_Options')->plugin('QPlayer2');
            try {
                if ($plugin->cacheType == 'none') {
                   echo _t('没有配置缓存！');
                } else {
                    Cache::BuildWithPlugin($plugin)->flush();
                    echo _t('操作成功！');
                }
                echo _t('5 秒后自动关闭！');
                echo '<script>setTimeout(window.close, 5000);</script>';
            } catch (Exception $e) {
                throw new Exception(_t('操作失败！'), 0, $e);
            }
            return;
        }

        $server = $request->get('server');
        $type = $request->get('type');
        $id = $request->get('id');

        if (!$this->check($server, $type, $id)) {
            http_response_code(403);
            die();
        }

        include_once 'libs/Meting.php';
        $m = new Metowolf\Meting($server);
        $m->format(true);

        $plugin = Typecho_Widget::widget('Widget_Options')->plugin('QPlayer2');
        $cookie = $plugin->cookie;
        if ($server == 'netease' && !empty($cookie)) {
            $m->cookie($cookie);
        }

        $isUesCache = $plugin->cacheType != 'none';
        if ($isUesCache) {
            $cache = Cache::BuildWithPlugin($plugin);
        }
        $key = $server . $type . $id;
        if ($isUesCache) {
            $data = $cache->get($key);
        }
        if (empty($data)) {
            $arg2 = null;
            $expire = 86400;
            switch ($type) {
                case 'audio':
                    $type = 'url';
                    $arg2 = $plugin->bitrate;
                    $expire = 1200;
                    break;
                case 'cover':
                    $type = 'pic';
                    $arg2 = 64;
                    break;
                case 'lrc':
                    $type = 'lyric';
                    break;
                case 'artist':
                    $arg2 = 50;
                    $expire = 7200;
                    break;
                default:
                    $expire = 7200;
            }
            $data = $m->$type($id, $arg2);
            if ($isUesCache) {
                $cache->set($key, $data, $expire);
            }
        }
        $data = json_decode($data, true);

        switch ($type) {
            case 'url':
            case 'pic':
                $url = $data['url'];
                if (empty($url)) {
                    if ($server != 'netease') {
                        http_response_code(403);
                        die();
                    }
                    $url = 'https://music.163.com/song/media/outer/url?id=' . $id . '.mp3';
                } else {
                    $url = preg_replace('/^http:/', 'https:', $url);
                }
                $this->response->redirect($url);
                exit;
            case 'lyric':
                header("Content-Type: text/plain");
                echo $data['lyric'] . "\n" . $data['tlyric'];
                exit;
            default:
                $url = Typecho_Common::url('action/QPlayer2', Helper::options()->index);
                $array = array();
                foreach ($data as $v) {
                    $prefix = $url . '?server=' . $v['source'];
                    $array []= array(
                        'name' => $v['name'],
                        'artist' => implode(' / ', $v['artist']),
                        'audio' => $prefix . '&type=audio&id=' . $v['url_id'],
                        'cover' => $prefix . '&type=cover&id=' . $v['pic_id'],
                        'lrc' => $prefix . '&type=lrc&id=' . $v['lyric_id'],
                        'provider' => 'default'
                    );
                }
                $data = $array;
        }

        header("Content-Type: application/json");
        echo json_encode($data);
    }

    private function check($server, $type, $id)
    {
        if (!in_array($server, array('netease', 'tencent', 'baidu', 'xiami', 'kugou'))) {
            return false;
        }
        if (!in_array($type, array('audio', 'cover', 'lrc', 'song', 'album', 'artist', 'playlist'))) {
            return false;
        }
        if (empty($id)) {
            return false;
        }
        return true;
    }
}