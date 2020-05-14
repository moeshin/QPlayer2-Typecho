<?php


namespace QPlayer\Cache;


class Memcached extends Cache
{
    private $memcached;

    public function __construct($host, $port)
    {
        if (empty($host)) {
            $host = '127.0.0.1';
        }
        if (empty($port)) {
            $port = '11211';
        }
        $this->memcached = new \Memcached();
        $this->memcached->addServer($host, $port);
        assert($this->memcached->getVersion() !== false);
    }

    public function set($key, $data, $expire = 86400)
    {
        return $this->memcached->set($key, $data, $expire);
    }

    public function get($key)
    {
        return $this->memcached->get($key);
    }
}