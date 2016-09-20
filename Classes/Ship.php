<?php

abstract class Ship{
    private $name;
    private $size;
    private $orientation;

    public function __construct($name, $size, $orientation){
        $this->name = $name;
        $this->size = $size;
        $this->orientation = $orientation;
    }

    public function __get($var){
        return $this->$var;
    }

    public function __set($var, $value) {
        $this->$var = $value;
    }

}
?>