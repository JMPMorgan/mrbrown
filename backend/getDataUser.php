<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$result=array('info'=>array());
try{
    if(isSessionCorrect()==true){
        $result['logged']=true;
        $uuid_session=session_id();
        $uuids=explode('-',$uuid_session);
        $sql="SELECT * FROM `users` WHERE `uuid`='{$uuids[1]}';";
        $rows=selectQuery($sql);
        if(!empty($rows)){
            $rows[0]['password_user']=decode($rows[0]['password_user']);
            $result['info']=$rows[0];
            $result['success']=true;
        }
        else{
            $result['error'][]='No se pudo conseguir la informacion, recargue la pagina o llame a soporte';
            $result['success']=false;
        }
    }
    else{
        $result['logged']=false;
        $result['error'][]='No se pudo obtener la sesion del usuario, por favor recargue e intente de nuevo';
        $result['success']=false;
    }
    echo json_encode($result);
    exit;
}
catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
    exit;
}
?>