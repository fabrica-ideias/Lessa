<?php 
	function uploadImage($file){
		$imgFile = $_FILES['file']['name'];
		$tmp_dir = $_FILES['file']['tmp_name'];
		$imgSize = $_FILES['file']['size'];
		if(!empty($imgFile)){
		   $upload_dir = '../uploads/'; // upload directory
		 
		   $imgExt = strtolower(pathinfo($imgFile,PATHINFO_EXTENSION)); // get image extension
		  
		   // valid image extensions
		   $valid_extensions = array('jpeg', 'jpg', 'png', 'gif'); // valid extensions
		  
		   // rename uploading image
		   $userpic = rand(1000,1000000).".".$imgExt;
		    
		   // allow valid image file formats
		   if(in_array($imgExt, $valid_extensions)){   
		    // Check file size '5MB'
		    if($imgSize < 5000000)    {
		     	move_uploaded_file($tmp_dir,$upload_dir.$userpic);
		     	return $userpic;
		    }
		    else{
		     	$errMSG = "Sorry, your file is too large.";
		    }
		   }
		   else{
		    	$errMSG = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";  
		   }
		}else{
			return "";
		}
	}
?>