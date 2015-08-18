<?php
class RoundItUp{
    private $db_user;
    private $db_pass;
    private $db_name;
    private $db_host;
    private $link;
    
    private $storeDetails;
	private $charities;
    
    function __construct($db_user, $db_pass, $db_name, $db_host) {
       $this->db_user = $db_user;
       $this->db_pass = $db_pass;
       $this->db_name = $db_name;
       $this->db_host = $db_host;
	   
	   $this->storeDetails = null;
	   $this->charities = array();
    }
    
    /*
     * Connect to database
     */
    public function connect(){
        $this->link = new mysqli($this->db_host, $this->db_user, $this->db_pass, $this->db_name);
        if ($this->link->connect_errno) {
            return false;
        }
        return true;
    }
    
    /*
     * Kill database connection
     */
    public function disconnect(){
        $this->link->close();
        return;
    }
    
    /*
     * Check if connection to database is established
     */
    public function is_connected(){
        return $this->link->ping();
    }

	/**
	 * Load current 15 top-rated charities
	 */
	public function loadCharities($limit=15){
        $query = "SELECT * FROM `charities` ORDER BY `weight`, `charitiy_name` LIMIT " . intval($limit) . ";";
        $result = $this->link->query($query);
		
        $this->charities = array();
		
        if($result) while ($row = $result->fetch_assoc()) {
			$this->charities[] = $row;
        }
        return false;
	}
	
	/**
	 * Return currently loaded charities
	 */
	public function getCharities() {
		return $this->charities;
	}
	
    /*
     * Check if store key exists
     */
    public function storeExists($store_id = null){
        if($store_id == null){
            return false;
        }
        
        $query = "SELECT * FROM `stores` WHERE `store_id` = '" . $store_id . "'";
        $result = $this->link->query($query);
        if($result){
            $this->storeDetails = $result->fetch_object();
            return true;
        }
        return false;
    }
    
    /*
     * Get store details
     */
    public function getStoreDetails(){
        return $this->storeDetails;
    }
    
	/**
	 * Returns last mysql error
	 * 
	 * @return string
	 */
	public function getLastMysqlError() {
		return $this->link->error;
	}
    /*
     * Create order token
     */
    public function createToken(){
        return $token = md5(uniqid(rand(), true));
    }
    
    /*
     * Create entry
     */
    public function createRoundUpEntry($store_id = null, $amount = null, $token = null, $ref = null, $charityUID = null){
        if($store_id == null || $amount == null){
            return false;
        }
        
		$query = "INSERT INTO `orders`(`store_id`, `order_id`, `amount`, `created`, `ref`, `charity_id`) VALUES ('$store_id', '$token', '$amount',UNIX_TIMESTAMP(NOW()), '" . ($ref === null ? '' : strval($ref) ) . "', " . ( (is_string($charityUID) && (strlen($charityUID) > 0)) ? "'{$charityUID}'" :'null') . ")";
        $result = $this->link->query($query);
        if($result){
            return true;
        }
        return false;
    }
    
    public function deleteRoundUpEntry($store_id = null, $token = null){
        if($store_id == null || $token == null){
            return false;
        }
        $query = "DELETE FROM `orders` WHERE `store_id` = '$store_id' AND `order_id` = '$token'";
        $result = $this->link->query($query);
        if($result){
            return true;
        }
        return false;
    }
    
    public function markPaidRoundUpEntry($store_id = null, $token = null){
        if($store_id == null || $token == null){
            return false;
        }
        $query = "UPDATE `orders` SET `is_paid` = 1 WHERE `store_id` = '$store_id' AND `order_id` = '$token'";
        $result = $this->link->query($query);
        if($result){
            return true;
        }
        return false;
    }
}


$output = array('status' => 'error', 'msg' => 'undefined');
$obj = new RoundItUp('humhub_e', 'P@$$w0rd1', 'roundup1', 'humhub.jerah.us');
//$obj = new RoundItUp('humhub_e', 'P@$$w0rd1', 'roundup', 'localhost'); /* dev mode*/

if(isset($_POST['action']) && $_POST['action'] == 'check'){
    if($obj->connect()){
        if($obj->storeExists($_POST['key'])){
            $store_details = $obj->getStoreDetails();
            if($store_details->active){
                $output = array('status' => 'success', 'token' => $obj->createToken());
            }else{
                $output = array('status' => 'error', 'msg' => 'STORE_NOT_ACTIVE');
            }
        }else{
            $output = array('status' => 'error', 'msg' => 'STORE_NOT_EXISTS');
        }

        $obj->disconnect();
    }else{
        $output = array('status' => 'error', 'msg' => 'NOT_CONNECTED');
    }
}

if(isset($_POST['action']) && $_POST['action'] == 'create'){
    if($obj->connect()){
        if($obj->storeExists($_POST['key'])){
			$obj->loadCharities();
            $store_details = $obj->getStoreDetails();
			
            if($store_details->active){
                if($obj->createRoundUpEntry($_POST['key'], $_POST['amount'], $_POST['token'], $_POST['ref'], $_POST['charityUID'])){
                    $output = array('status' => 'success');
                }else{
                    $output = array('status' => 'error', 'msg' => 'ENTRY_NOT_CREATED', 'mysql_error' => $obj->getLastMysqlError());
                }
            }else{
                $output = array('status' => 'error', 'msg' => 'STORE_NOT_ACTIVE');
            }
        }else{
            $output = array('status' => 'error', 'msg' => 'STORE_NOT_EXISTS');
        }

        $obj->disconnect();
    }else{
        $output = array('status' => 'error', 'msg' => 'NOT_CONNECTED');
    }
}

if(isset($_POST['action']) && $_POST['action'] == 'delete'){
    if($obj->connect()){
        if($obj->storeExists($_POST['key'])){
			$obj->loadCharities();
            $store_details = $obj->getStoreDetails();
			
            if($store_details->active){
                if($obj->deleteRoundUpEntry($_POST['key'], $_POST['token'])){
                    $output = array('status' => 'success');
                }else{
                    $output = array('status' => 'error', 'msg' => 'ENTRY_NOT_DELETED', 'mysql_error' => $obj->getLastMysqlError());
                }
            }else{
                $output = array('status' => 'error', 'msg' => 'STORE_NOT_ACTIVE');
            }
        }else{
            $output = array('status' => 'error', 'msg' => 'STORE_NOT_EXISTS');
        }

        $obj->disconnect();
    }else{
        $output = array('status' => 'error', 'msg' => 'NOT_CONNECTED');
    }
}

if(isset($_POST['action']) && $_POST['action'] == 'paid'){
    if($obj->connect()){
        if($obj->storeExists($_POST['key'])){
			$obj->loadCharities();			
            $store_details = $obj->getStoreDetails();
			
            if($store_details->active){
                if($obj->markPaidRoundUpEntry($_POST['key'], $_POST['token'])){
                    $output = array('status' => 'success');
                }else{
                    $output = array('status' => 'error', 'msg' => 'ENTRY_NOT_MARKED_PAID', 'mysql_error' => $obj->getLastMysqlError());
                }
            }else{
                $output = array('status' => 'error', 'msg' => 'STORE_NOT_ACTIVE');
            }
        }else{
            $output = array('status' => 'error', 'msg' => 'STORE_NOT_EXISTS');
        }

        $obj->disconnect();
    }else{
        $output = array('status' => 'error', 'msg' => 'NOT_CONNECTED');
    }
}

if(isset($_POST['action']) && $_POST['action'] == 'charities'){
    if($obj->connect()){
        if($obj->storeExists($_POST['key'])){
			$store_details = $obj->getStoreDetails();
			if($store_details->active){
				$obj->loadCharities();			
				$_charities = $obj->getCharities();
				
				$charities = array();
				if ( count($_charities) > 0 ) foreach($_charities as $_charity) {
					$charities[] = array(
							'uid' => $_charity['charity_id'],
							'name' => $_charity['charitiy_name'],
							'ref' => $_charity['ref'],
						);
				}
				
				if ( count($charities) > 0 ) {
					$output = array('status' => 'success', 'charities' => $charities);
				} else {
					$output = array('status' => 'error', 'msg' => 'CHARITY_NOT_FOUND');
				}
            }else{
                $output = array('status' => 'error', 'msg' => 'STORE_NOT_ACTIVE');
            }
        }else{
            $output = array('status' => 'error', 'msg' => 'STORE_NOT_EXISTS');
        }
			
        $obj->disconnect();
    }else{
        $output = array('status' => 'error', 'msg' => 'NOT_CONNECTED');
    }
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
echo json_encode($output);