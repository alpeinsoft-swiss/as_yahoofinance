<?php

class asyahoofinance_itemsProcFunc
{


    /**
     * Get the defined styles by pagesetup
     * @param array $config
     * @param array $item
     */
    public function getStyle($config, $item) {
        $allStyles = array(
            array(
                $GLOBALS['LANG']->sL('LLL:EXT:as_yahoofinance/Resources/Private/Language/locallang.xlf:tt_content.as_yahoofinance.style.I.0'),
                'chart',
                'EXT:as_yahoofinance/chart.png',
            ),
            array(
                $GLOBALS['LANG']->sL('LLL:EXT:as_yahoofinance/Resources/Private/Language/locallang.xlf:tt_content.as_yahoofinance.style.I.1'),
                'nochart',
                'EXT:as_yahoofinance/list.png',
            ),


        );
        $confArr = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['as_yahoofinance']);
        $styles = $confArr['style.'];
        if (count($styles) > 0) {
            foreach ($styles as $key => $val) {
                if ($val) {
                    $availableStyles[] = $key;
                }
            }
        }

        if (count($availableStyles) < 1) {
            $availableStyles = array('chart','nochart');
        }

        $allowedStyles = array();
        foreach ($allStyles as $key => $style) {
            if (in_array(trim($style[1]), $availableStyles)) {
                $allowedStyles[] = $style;
            }
        }
        $pageTS = \TYPO3\CMS\Backend\Utility\BackendUtility::getPagesTSconfig($config['row']['pid']);
        $as_yahoofinance = \TYPO3\CMS\Core\Utility\GeneralUtility::trimExplode(",", $pageTS['mod.']['as_yahoofinance.']['availableStyles'], TRUE);
        $optionList = array();
        if (count($as_yahoofinance) > 0) {

            foreach ($allowedStyles as $key => $style) {
                if (in_array(trim($style[1]), $as_yahoofinance)) {
                    $optionList[] = $style;
                }
            }
        } else {

            $optionList = $allowedStyles;
        }
        $config['items'] = array_merge($config['items'], $optionList);

        return $config;
    }


}
