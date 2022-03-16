<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
if(!empty($fields)){
    $fields['user']=removeEspecialChar($fields['user']);
    $fields['password']=removeEspecialChar($fields['password']);
    $result=validations($fields['user'],$fields['password']);
    if($result['success']==true){
        $fields['password']=encode($fields['password']);
        $sql="SELECT `uuid` FROM `users` WHERE `nick_user`='{$fields['user']}' AND `password_user`='{$fields['password']}';";
        $rows=selectQuery($sql);
        if(!empty($rows)){
            //AQUI IRIA SI EL LOGIN ES CORRECTO
            $uuid_session=generateRandomToken();
            $user_uuid=$rows[0]['uuid'];
            $uuid_session.='-'.$user_uuid;
            session_id($uuid_session);
            $isSessionStart=session_start();
            if($isSessionStart==true){
                $_SESSION['uuid_session']=$uuid_session;
                $user_uuid=encode($user_uuid);
                array_push($result,$user_uuid);
                echo json_encode($result);
                exit;
            }
            else{
                $result['error'][]='Error al ingresar al sistema por favor recargue la pagina';
                echo json_encode($result);
                exit;
            }
        }
        else{
            $result['error'][]='Error al ingresar al sistema por favor recargue la pagina 1';
            echo json_encode($result);
            exit;
        }
    }else{

    }
}

function validations($user,$password){
    $result=array('error'=>array());
    if(strlen($user)<=0||is_numeric($user)){
        $result['error'][]='El usuario no cumple con los requisitos,verificar la informacion';
    }
    if(strlen($password)<8||is_numeric($password)){
        $result['error'][]='La contraseña del usuario no cumple con los requisitos,verificar la informacion';
    }
    if(count($result['error'])==0){
        $result['success']=true;
        return $result;
    }
    else{
        $result['success']=false;
        return $result;    
    }
}
?>