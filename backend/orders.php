<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(isSessionCorrect()==true){
        $result['logged']=true;
        switch ($fields['id']) {
            case 1:#Ingresar una nueva order
                /*
                id_order esta encriptada
                method tambien
                */
                $uuid=generateRandomToken();
                $fields['method']=decode($fields['method']);
                $sql="INSERT INTO `orders`(`id`,`lat_pedido`,`lng_pedido`,`id_info_pay`,`id_stores_info`,`date_creation`)
                VALUES('{$uuid}','{$fields['lat']}','{$fields['lng']}','{$fields['method']}','{$fields['sucursal']}',NOW());";
                $isInsert=execQuery($sql);
                if($isInsert>0){
                    foreach($fields['data_food'] as $food){
                        $sql="INSERT INTO `food_order`(`id_food`,`id_orders`,`how_many`) VALUES('{$food['uuid']}','{$uuid}','{$food['number']}');";
                        $isInsert=execQuery($sql);
                    }
                    $result['success']=true;
                    $result['info']=$uuid;
                    echo json_encode($result);
                    exit;
                }else{
                    $result['success']=false;
                    $result['error'][]='No se pudo ingresar la orden';
                    echo json_encode($result);
                    exit;
                }
                break;
            default:
                $result['success']=false;
                $result['error'][]='No se pudo encontrar un caso especifico';
                echo json_encode($result);
                # code...
                break;
        }
    }else{
        $result['success']=false;
        $result['logged']=false;
        echo json_encode($result);
        exit;
    }
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;
}
?>