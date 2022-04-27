<?php 
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try
{
    if(isSessionCorrect()==true){
        $result['logged']=true;
        switch ($fields['id']) {
            case 1:
                # code...
                $sql="SELECT `lat`,`lng`,`nombre`,`id` FROM `stores_info`;";
                $rows=selectQuery($sql);
                if(!empty($rows)){
                    $result['info']=$rows;
                    $result['success']=true;
                    echo json_encode($result);
                }else{
                    $result['success']=false;
                    $result['error'][]='No se pudo encontrar la informacion de las tiendas';
                    echo json_encode($result);
                }
                break;
            default:
                $result['success']=true;
                $result['error'][]='No existe una seleccion para esto';
                echo json_encode($result);
                # code...
                break;
        }
    }else{
        $result['logged']=false;
        $result['success']=false;
        echo json_encode($result);
        exit;
    }
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit ;  
}
?>