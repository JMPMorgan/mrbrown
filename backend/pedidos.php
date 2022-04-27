<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(isSessionCorrect()==true){
        $result['logged']=true;
        $uuid_session=session_id();
        $uuids=explode('-',$uuid_session);
        $sql="SELECT `orders`.`id`, `lat_pedido`,`lng_pedido`,DATE_FORMAT(`date_creation`,'%d/%m/%Y') as `date_creation`,
         `info_pay`.`card`,`stores_info`.`nombre` 
         FROM `orders` 
         INNER JOIN `info_pay` ON `info_pay`.`id`=`orders`.`id_info_pay` 
         INNER JOIN `stores_info` ON `stores_info`.`id`=`orders`.`id_stores_info` 
         WHERE `info_pay`.`uuid_name`='{$uuids[1]}'; ";

           /*

        ,`food`.`name_food`,`food`.`price_food`,`food_order`.`how_many`

                    INNER JOIN `food_order` ON `food_order`.`id_orders`=`orders`.`id`
          INNER JOIN `food` ON `food`.`uuid`=`food_order`.`id_food`
           */
        $rows=selectQuery($sql);
        if(!empty($rows)){
            $count_rows=count($rows);
            for ($i=0; $i < $count_rows; $i++) { 
                $sql="SELECT `food`.`name_food`,`food`.`price_food`,`food_order`.`how_many`
                FROM `food_order`
                INNER JOIN `food` ON `food`.`uuid`=`food_order`.`id_food`
                WHERE `food_order`.`id_orders`='{$rows[$i]['id']}'";
                $rows2=selectQuery($sql);
                $rows[$i]['order']=$rows2;
                $rows[$i]['card']=decode($rows[$i]['card']);
            }
            $result['info']=$rows;
            $result['success']=true;
        }else{
            $result['success']=false;
            $result['error'][]='No se ha realizado pedidos con este usuario';
        }
    }else{
        $result['success']=false;
        $result['logged']=false;
    }
    echo json_encode($result);
    exit;
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
}
?>