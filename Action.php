<?php
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

class QPlayer2_Action extends Typecho_Widget implements Widget_Interface_Do
{
    public function action()
    {
        $request = $this->request;


        $server = $request->get('server');
        $type = $request->get('type');
        $id = $request->get('id');

        if (!$this->check($server, $type, $id)) {
            http_response_code(403);
            die();
        }

        include_once 'Meting.php';
        $m = new Metowolf\Meting($server);
        $m->format(true);

//        $plugin = Typecho_Widget::widget('Widget_Options')->plugin('QPlayer2');
//        $cookie = $plugin->cookie;
//        if ($server == 'netease' && !empty($cookie)) {
//            $m->cookie($cookie);
//        }

        // TODO 缓存

        $arg2 = null;
        switch ($type) {
            case 'audio':
                $type = 'url';
                $arg2 = 320;
//                $arg2 = $plugin->bitrate;
                break;
            case 'cover':
                $type = 'pic';
                $arg2 = 2;
                break;
            case 'artist':
                $arg2 = $request->get('limit', 50);
                break;
            case 'lrc':
                $type = 'lyric';
                break;
        }

        $data = $m->$type($id, $arg2);
        $data = json_decode($data, true);

        switch ($type) {
            case 'url':
            case 'pic':
                $url = $data['url'];
                if (empty($url)) {
                    http_response_code(403);
                    die();
                }
                $url = preg_replace('/^http:/', 'https:', $url);
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