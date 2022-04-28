<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('error'=>array());
try{
    if(isSessionCorrect()==true){
        $result['logged']=true;
        $uuid_session=session_id();
        $uuids=explode('-',$uuid_session);
        $fields['name']=removeEspecialChar($fields['name']);
        $fields['lastname']=removeEspecialChar($fields['lastname']);
        $fields['oldpassword']=removeCharForSpaces($fields['oldpassword']);
        $fields['oldpassword']=encode($fields['oldpassword']);
        $fields['email']=removeCharForSpaces($fields['email']);
        if(isEmail($fields['email'])==true){
            $sql="SELECT COUNT('uuid') as `id` FROM `users` 
            WHERE `uuid`='{$uuids[1]}'
            AND `password_user`='{$fields['oldpassword']}';";
            $rows=selectQuery($sql);
            if($rows[0]['id']>0){
                if($fields['isNew']=='true'){
                    $fields['newpassword']=removeCharForSpaces($fields['newpassword']);
                    $fields['confirmpassword']=removeCharForSpaces($fields['confirmpassword']);
                    if(strcmp($fields['newpassword'],$fields['confirmpassword'])!=0){
                        $result['error'][]='Las contraseñas no coinciden';
                        $result['success']=false;
                        echo json_encode($result);
                        exit;
                    }else{
                        $fields['newpassword']=encode($fields['newpassword']);
                        $fields['confirmpassword']=encode($fields['confirmpassword']);

                        $sql="UPDATE `users` 
                        SET `name_user`='{$fields['name']}', 
                        `lastname_user`='{$fields['lastname']}',
                        `email_user`='{$fields['email']}',
                        `password_user`='{$fields['newpassword']}'
                        WHERE `uuid`='{$uuids[1]}'
                        AND `password_user`='{$fields['oldpassword']}';";
                        $isUpdated=execQuery($sql);
                        if($isUpdated>0){
                            $result['success']=true;
                        }else{
                            $result['success']=false;
                            $result['error'][]='No se pudo modificar la informacion del usuario, intente de nuevo';
                        }
                    }
                }else{
                    
                    $sql="UPDATE `users` 
                    SET `name_user`='{$fields['name']}', 
                    `lastname_user`='{$fields['lastname']}',
                    `email_user`='{$fields['email']}'
                    WHERE `uuid`='{$uuids[1]}'
                    AND `password_user`='{$fields['oldpassword']}';";
                    $isUpdated=execQuery($sql);
                    if($isUpdated>0){
                        $result['success']=true;
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo modificar la informacion del usuario, intente de nuevo';
                    }
                }
            }else{
                $result['success']=false;
                $result['error'][]='No se encontro el usuario con esa contraseña inserte de su antigua contraseña';
            }
        }
        else{
            $fields['success']=false;
            $fields['error'][]='El formato del email es invalido';
        }
    }else{
        $result['logged']=false;
        $result['success']=false;
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