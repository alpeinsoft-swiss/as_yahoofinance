<?php

if (!defined('TYPO3_MODE')) {
    die('Access denied.');
}

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig('<INCLUDE_TYPOSCRIPT: source="FILE:EXT:'.$_EXTKEY.'/Configuration/PageTS/TSConfig.ts">');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
    'YahooFinance.'.$_EXTKEY,
    'Yahooplugin',
    array(
        'YahooFinance' => 'list, financeData',
    ),
    array(
        'YahooFinance' => 'list, financeData',
    )
);
