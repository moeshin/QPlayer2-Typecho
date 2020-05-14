<?php


namespace QPlayer\Cache;

use Exception;
use ReflectionClass;

abstract class Cache
{
    public abstract function set($key, $data, $expire = 86400);
    public abstract function get($key);

    public function install() {}
    public function uninstall() {}

    /**
     * @throws Exception
     */
    public function test() {
        $id = uniqid();
        $this->set('test', $id, 60);
        if ($this->get('test') != $id) {
            throw new Exception('Cache test error!');
        }
    }

    /**
     * @param string $type
     * @param array $args
     * @return Cache
     * @throws Exception
     * @noinspection PhpIncompatibleReturnTypeInspection
     */
    public static function Builder($type, ...$args) {
        $type = ucfirst($type);
        if (!in_array($type, array('Database', 'Memcached', 'Redis'))) {
            throw new Exception("Cache type error: $type");
        }
        include_once("$type.php");
        return (new ReflectionClass('\QPlayer\Cache\\' . $type))->newInstanceArgs($args);
    }
}
