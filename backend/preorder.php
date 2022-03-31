<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(isSessionCorrect()==true){
        $uuids=session_id();
        $uuids=explode('-',$uuids);
        $sql="SELECT `id`, `preorder` FROM `preorders_log` WHERE `uuid_user`= '{$uuids[1]}' ORDER BY `creation_time` DESC LIMIT 1;";
        $rows=selectQuery($sql);
        if(!empty($rows)){
            $rows[0]['id']=encode($rows[0]['id']);
            $result['info']=$rows[0];
            $result['success']=true;
        }
        else{
            $result['success']=false;
            $result['error'][]='No se pudo recuperar la orden establecida,por favor realice el pedido de nuevo';
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
    exit;
}
?>