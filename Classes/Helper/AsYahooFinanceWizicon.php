<?php
/**
 * Created by PhpStorm.
 * User: Lenovo
 * Date: 17.02.2016
 * Time: 10:37
 */
use TYPO3\CMS\Extbase\Utility\LocalizationUtility;

/**
 * Class that adds the wizard icon.
 */
class AsYahooFinanceWizicon {

    /**
     * Processing the wizard items array
     *
     * @param array $wizardItems : The wizard items
     * @return Modified array with wizard items
     */
    function proc( $wizardItems ) {

        $version = explode('.', TYPO3_version);
        if ($version[0] < 8) {
            if ($version[0] < 7) {
                $wizardItems['plugins_tx_asyahoofinance_yahooplugin'] = array(
                    'icon' => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extRelPath('as_yahoofinance') . 'Resources/Public/Icons/wizard_icon.png',
                    'title' => LocalizationUtility::translate('plugin_label', 'as_yahoofinance'),
                    'description' => LocalizationUtility::translate('plugin_value', 'as_yahoofinance'),
                    'params' => '&defVals[tt_content][CType]=list&defVals[tt_content][list_type]=asyahoofinance_yahooplugin'
                );
            }else{
                 $wizardItems['plugins_tx_asyahoofinance_yahooplugin'] = array(
                    'icon' => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extRelPath('as_yahoofinance') . 'Resources/Public/Icons/wizard_icon.svg',
                    'title' => LocalizationUtility::translate('plugin_label', 'as_yahoofinance'),
                    'description' => LocalizationUtility::translate('plugin_value', 'as_yahoofinance'),
                    'params' => '&defVals[tt_content][CType]=list&defVals[tt_content][list_type]=asyahoofinance_yahooplugin'
                );
            }
           
        }else{
            $iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);
            $iconRegistry->registerIcon(
                'extension-as-yahoofinance',
                \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
                ['source' => 'EXT:as_yahoofinance/Resources/Public/Icons/wizard_icon.svg']
            );
        }

        return $wizardItems;
    }

}