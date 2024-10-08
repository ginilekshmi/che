/*********************************************************************
 * Copyright (c) 2019-2023 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
import 'reflect-metadata';
import { ICheLoginPage } from './ICheLoginPage';
import { OcpLoginPage } from '../openshift/OcpLoginPage';
import { injectable, inject } from 'inversify';
import { CLASSES } from '../../configs/inversify.types';
import { TestConstants } from '../../constants/TestConstants';
import { Logger } from '../../utils/Logger';
import { TimeoutConstants } from '../../constants/TimeoutConstants';
import { By } from 'selenium-webdriver';
import { DriverHelper } from '../../utils/DriverHelper';

@injectable()
export class RegularUserOcpCheLoginPage implements ICheLoginPage {

    private readonly OPEN_SHIFT_LOGIN_LANDING_PAGE_LOCATOR: string = `//div[@class='panel-login']`;
    private readonly OPEN_SHIFT_LOGIN_LANDING_PAGE_BUTTON_LOCATOR: string = `${this.OPEN_SHIFT_LOGIN_LANDING_PAGE_LOCATOR}/div[contains(@class, 'panel-content')]/form/button`;

    constructor(
        @inject(CLASSES.OcpLoginPage) private readonly ocpLogin: OcpLoginPage,
        @inject(CLASSES.DriverHelper) private readonly driverHelper: DriverHelper) { }

    async login(): Promise<void> {
        Logger.debug('RegularUserOcpCheLoginPage.login');

        Logger.debug('RegularUserOcpCheLoginPage.login wait for LogInWithOpenShift page and click button');
        await this.driverHelper.waitPresence(By.xpath(this.OPEN_SHIFT_LOGIN_LANDING_PAGE_LOCATOR), TimeoutConstants.TS_SELENIUM_LOAD_PAGE_TIMEOUT);
        await this.driverHelper.waitAndClick(By.xpath(this.OPEN_SHIFT_LOGIN_LANDING_PAGE_BUTTON_LOCATOR));

        if (await this.ocpLogin.isIdentityProviderLinkVisible()) {
            await this.ocpLogin.clickOnLoginProviderTitle();
        }

        await this.ocpLogin.waitOpenShiftLoginWelcomePage();
        await this.ocpLogin.enterUserNameOpenShift(TestConstants.TS_SELENIUM_OCP_USERNAME);
        await this.ocpLogin.enterPasswordOpenShift(TestConstants.TS_SELENIUM_OCP_PASSWORD);
        await this.ocpLogin.clickOnLoginButton();
        await this.ocpLogin.waitDisappearanceOpenShiftLoginWelcomePage();

        if (await this.ocpLogin.isAuthorizeOpenShiftIdentityProviderPageVisible()) {
            await this.ocpLogin.waitAuthorizeOpenShiftIdentityProviderPage();
            await this.ocpLogin.clickOnApproveAuthorizeAccessButton();
        }
    }
}
