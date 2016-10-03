<?php

class Navigator {

    public static function changePage($page) {

?>
        <script>
            window.location = "<?= $page; ?>";
        </script>
<?php

    } 

}

?>