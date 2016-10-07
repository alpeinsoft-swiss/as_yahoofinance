<?php

namespace YahooFinance\AsYahoofinance\Controller;

/**
 * YahooFinanceController.
 */
class YahooFinanceController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController
{

    /**
     * action list.
     */
    public function listAction()
    {
        $this->init();
    }

    public function init(){
        $UID = $this->getUID();
        $this->view->assign('uid',  $UID);
        if (!$this->settings['width']) $this->settings['width'] = $this->settings['widthDef'];
        if (!$this->settings['height']) $this->settings['height'] = $this->settings['heightDef'];
        $this->view->assign('allSet', $this->settings);
        $this->view->assign('settings', json_encode($this->settings));
    }

    public function getUID(){
        $this->contentObj = $this->configurationManager->getContentObject();
        debug($this->contentObj->data, "current tt_content's data");
        $UID = $this->contentObj->data['uid'];
        return $UID;
    }


}
