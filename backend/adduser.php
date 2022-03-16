<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
if(!empty($fields)){
    $fields['name']=removeEspecialChar($fields['name']);
    $fields['lastname']= removeEspecialChar($fields['lastname']);
    $fields['user']=removeEspecialChar($fields['user']);
    $fields['email']=removeCharForSpaces($fields['email']);
    $fields['password']=removeEspecialChar($fields['password']);
    $fields['phone']=removeCharForSpaces($fields['phone']);
    $fields['gender']=removeCharForSpaces($fields['gender']);
    $result=validations($fields['name'],$fields['lastname'],$fields['email'],$fields['password'],$fields['phone'],$fields['gender']);
    if($result['success']==true){
        $fields['password']=encode($fields['password']);
        $uuid=generateRandomToken();
        $sql="SELECT COUNT(uuid) AS `numero` FROM `users` WHERE nick_user='{$fields['user']}' OR email_user='{$fields['email']}';";
        $existUser=selectQuery($sql);
        if($existUser[0]['numero']==0){
            $sql = "INSERT INTO `users`(`name_user`,`lastname_user`,`nick_user`,`email_user`,
            `phone_user`,`password_user`,`gender_user`,`uuid`) VALUES('{$fields['name']}',
             '{$fields['lastname']}','{$fields['user']}','{$fields['email']}','{$fields['phone']}',
            '{$fields['password']}','{$fields['gender']}','{$uuid}');";
            $isInsert = execQuery($sql);
            if (is_numeric($isInsert)) {
                $result['success'] = true;
                echo json_encode($result);
                exit;
            } else {
                $result['success'] = false;
                $result['error'][] = 'No se pudo ingresar la informacion correctamente recargue la pagina e intentelo de nuevo';
                echo json_encode($result);
                exit;
            }
        }
        else{
            $result['success']=false;
            $result['error'][]='Existe el nickname o email ingrese uno diferente por favor';
            echo json_encode($result);
            exit;
        }
    }
    else{
        $result['success']=false;
        echo json_encode($result);
        exit;
    }

}
else{
    $result=array();
    $result['success']=false;
    $result['error'][]='No se obtuvo la informacion, recargue la pagina e intente de nuevo';
    echo json_encode($result);
}

function validations($name,$lastname,$email,$password,$phone,$gender){
    $result=array('error'=>array());
    if(strlen($name)<=0||is_numeric($name)){
        $result['error'][]='El nombre del usuario no cumple con los requisitos,verificar la informacion';
    }
    if(strlen($lastname)<=0||is_numeric($lastname)){
        $result['error'][]='El apellido del usuario no cumple con los requisitos,verificar la informacion';

    }
    if(strlen($email)<=0||is_numeric($email)){
        $result['error'][]='El email del usuario no cumple con los requisitos,verificar la informacion';

    }
    if(strlen($password)<8||is_numeric($password)){
        $result['error'][]='La contraseña del usuario no cumple con los requisitos,verificar la informacion';
    }
    if(strlen($phone)!=10||!is_numeric($phone)){
        $result['error'][]='El numero telefonico debe ser solo numeros y su longitud debe ser igual a 10';
    }
    if(strlen($gender)<=0 ){
        $result['error'][]='Debe seleccionar un sexo';
    }
    else{
        if(strcmp($gender,'male')==0){
            $gender=0;
        }
        else if(strcmp($gender,'female')==0){
            $gender=1;
        }
        else {
            $result['error'][]='Valor en la casilla sexo invalido, recargue la pagina e intentelo de nuevo';
        }
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