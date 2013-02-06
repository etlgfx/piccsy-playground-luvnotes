<?php

require 'aws/sdk.class.php';

$ses = new AmazonSES(array(
	'key' => 'AKIAJ4M52OH5J2JQ2NDQ',
	'secret' => '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'));

if (empty($_POST['note']) || !isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest')
{
	echo json_encode(array('error' => true));
	die();
}

$result = $ses->send_email(
	'Luvnotes <info+luvnotes@piccsy.com>',
	array('ToAddresses' => array('info+luvnotes@piccsy.com')),
	array(
		'Subject' => array('Data' => 'luvnotes'),
		'Body' => array('Text' => array('Data' => $_POST['note'])),
	)
);

if (!$result->isOK()) {
	echo $result->body->to_json();
}
else {
	echo json_encode(array('success' => true));
}
