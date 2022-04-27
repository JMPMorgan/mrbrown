<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    switch ($fields['id']) {
        case 1:{#Obtener el numero de tarjetas registrados por el usuario para realizar la orden
            if(isSessionCorrect()==true){
                $result['logged']=true;
                $uuids = explode('-', session_id());
                $sql="SELECT `id`,`card` FROM `info_pay` WHERE `uuid_name`='{$uuids[1]}';";
                $rows=selectQuery($sql);
                if(!empty($rows)){
                    $count_rows=count($rows);
                    for ($i=0; $i < $count_rows ; $i++) { 
                        $rows[$i]['card']=decode($rows[$i]['card']);
                        $rows[$i]['id']=encode($rows[$i]['id']);
                    }
                    $result['success']=true;
                    $result['info']=$rows;
                }else{
                    $result['false']=false;
                    $result['error'][]=2;
                }
                echo json_encode($result);
                exit;
            }else{
                $result['success']=false;
                $result['logged']=false;
                echo json_encode($result);
                exit;
            }
        } break;
        case 2:{
            if(isSessionCorrect()==true){
                $result['logged']=true;
                $uuids=explode('-',session_id());
                $errors=array();
                $fields['num_card']=removeEspecialChar($fields['num_card']);
                $fields['ccv']=removeEspecialChar($fields['ccv']);
                $fields['date_exp']=removeEspecialChar($fields['date_exp']);
                if(is_numeric($fields['num_card'])===false){
                    $errors[]='Solo acepta numeros el campo de tarjeta';
                }
                if(strlen($fields['num_card'])!==16){
                    $errors[]='Solo debe ser de longitud igual a 16';
                }
                if(is_numeric($fields['num_card'])===false){
                    $errors[]='Solo debe ingresar numeros en el campo de CCV';
                }
                if(count($errors)>0){
                    $result['success']=false;
                    $result['error']=$errors;
                    echo json_encode($result);
                    exit;
                }else{
                    $fields['num_card']=encode($fields['num_card']);
                    $fields['ccv']=encode($fields['ccv']);
                    $sql="INSERT INTO `info_pay`(`uuid_name`,`card`,`expiration_date`,`security_code`) 
                    VALUES('{$uuids[1]}','{$fields['num_card']}','{$fields['date_exp']}','{$fields['ccv']}');";
                    $isInsert=execQuery($sql);
                    if($isInsert>0){
                        $result['success']=true;
                        echo json_encode($result);
                        exit;
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo ingresar la informacion de la tarjeta recargue e intente de nuevo';
                        echo json_encode($result);
                        exit;
                    }
                }
            }else{
                $result['success']=false;
                $result['logged']=false;
                echo json_encode($result);
                exit;
            }
        }break;
        default:
            # code...
            break;
    }
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;
}
?>