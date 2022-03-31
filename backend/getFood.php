<?php 
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$result=array('info'=>array());
try{
    $sql='SELECT * FROM `food`;';
    $rows=selectQuery($sql);
    if(!empty($rows)){
        if(isSessionCorrect()==true){
            /*
            Esto es para saber si el usuario esta con la sesion para despues 
            ordenar comida
            */
            $result['logged']=true;
        }
        else{
            $result['logged']=false;
        }
        
        array_push($result['info'],$rows);
        $result['success']=true;
        echo json_encode($result);
    }
    else{
        $result['success']=false;
        $result['error'][]='No se obtuvo la lista de alimentos, recargue de nuevo ';
        echo json_encode($result);
    }
    exit;
}
catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
    exit;
}
?>
