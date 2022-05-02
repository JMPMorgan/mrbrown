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
        $sql="SELECT `preorder` FROM `preorders_log` WHERE `uuid_user`='{$uuids[1]}'ORDER BY `preorders_log`.`creation_time` DESC LIMIT 1;";
        $rows=selectQuery($sql);
        if(!empty($rows)){
            $preconvertorders=json_decode($rows[0]['preorder']);
            $uuids_order=$preconvertorders->uuidsOrder;
            $count_uuidsOrder=count($uuids_order);
            for ($i=0; $i < $count_uuidsOrder ; $i++) { 
                $sql="SELECT `price_food` from `food` WHERE `uuid`='{$uuids_order[$i]->uuid}';";
                $info_food=selectQuery($sql);
                $price_food=$info_food[0]['price_food'];
                $uuids_order[$i]->price_food_normally=$price_food;
            }   
            $rows[0]['preorder']=$uuids_order;
            $result['success']=true;
            $result['info']=$rows[0];
            echo json_encode($result);
            exit;
        }else{
            $result['success']=false;
            $result['error'][]='No se obtuvo ninguna orden';
            echo json_encode($result);
            exit;
        }
    }else{
        $result['logged']=false;
        $result['success']=false;
        echo json_encode($result);
    }
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
}
?>