<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(!empty($fields)){
        $result['info']=$fields;
        if(isSessionCorrect()==true){
            //Aqui iria si la sesion ya se inicio
            
            $result['logged']=true;
            $uuids=session_id();
            $uuids=explode('-',$uuids);
            $preoder=json_encode($fields);
            $sql="INSERT INTO `preorders_log`(`uuid_user`,`preorder`,`creation_time`) VALUES('{$uuids[1]}','$preoder',NOW());";
            $isInsert=execQuery($sql);
            if($isInsert>0){
                $result['success']=true;
            }
            else{
                $result['success']=false;
                $result['error'][]='No se pudo realizar la preorden,intente de nuevo';
            }
        }else{
            //Aqui se iria si no se inicia sesion
            $result['success']=true;
            $result['logged']=false;
        }

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