<?php
class Carrier extends Ship{

    public function __construct($orientation){
        parent::__construct('Carrier', 5, $orientation);
    }
}

?>