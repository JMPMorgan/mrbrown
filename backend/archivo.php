<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$info_pizzas=array("Pizza Boneless","Pizzas Margaritas","Pizza Supreme","Pizza Flaming Chesse","Pizza Pepperoni");
$info_images=array("pizza_boneless.png","pizza_margarita.png","pizza_supreme.png","pizza_flamin_chesse.png","pizza_peperoni.png");
$count_pizzas=count($info_pizzas);
for ($i=0; $i < $count_pizzas ; $i++) { 
    $uuid=generateRandomToken();
    $sql="INSERT INTO `food`(`uuid`, `name_food`, `image_food`, `type_food`) VALUES('{$uuid}','{$info_pizzas[$i]}','{$info_images[$i]}','pizzas');" ;
    execQuery($sql);
}
?>