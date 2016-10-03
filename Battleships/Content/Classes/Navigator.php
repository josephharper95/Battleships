<!--
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    01/10/16    initial creation
*
-->

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