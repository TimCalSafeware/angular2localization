/**
 * ANGULAR 2 LOCALIZATION
 * An Angular 2 library to translate messages, dates and numbers.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular2localization
 */

import {Injectable, EventEmitter, Output} from '@angular/core';

/**
 * LocaleService class.
 * 
 * Instantiate this class only once in the route component in order to access the data of location from anywhere in the application: 
 * 
 * FIRST SCENARIO - Dates & numbers.
 * 
 * import {LocaleService} from 'angular2localization/angular2localization';
 *
 * @Component({
 *     selector: 'app-component',
 *     ...
 *     providers: [LocaleService] // Inherited by all descendants.
 * })
 * 
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService) {
 * 
 *         // Required: default language (ISO 639 two-letter or three-letter code) and country (ISO 3166 two-letter, uppercase code).
 *         this.locale.definePreferredLocale('en', 'US');
 * 
 *         // Optional: default currency (ISO 4217 three-letter code).
 *         this.locale.definePreferredCurrency('USD');
 * 
 *      }
 * 
 * }
 * 
 * SECOND SCENARIO - Messages.
 * 
 * import {LocaleService, LocalizationService} from 'angular2localization/angular2localization';
 *
 * @Component({
 *     selector: 'app-component',
 *     ...
 *     providers: [LocaleService, LocalizationService] // Inherited by all descendants.
 * })
 * 
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService, public localization: LocalizationService) {
 * 
 *         // Adds a new language (ISO 639 two-letter or three-letter code).
 *         this.locale.addLanguage('en');
 *         // Add a new language here.
 * 
 *         // Required: default language and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
 *         this.locale.definePreferredLanguage('en', 30);
 *           
 *     }
 * 
 * }
 * 
 * THIRD SCENARIO - Messages, dates & numbers.
 * 
 * import {LocaleService, LocalizationService} from 'angular2localization/angular2localization';
 *
 * @Component({
 *     selector: 'app-component',
 *     ...
 *     providers: [LocaleService, LocalizationService] // Inherited by all descendants.
 * })
 * 
 * export class AppComponent {
 * 
 *     constructor(public locale: LocaleService, public localization: LocalizationService) {
 * 
 *         // Adds a new language (ISO 639 two-letter or three-letter code).
 *         this.locale.addLanguage('en');
 *         // Add a new language here.
 * 
 *         // Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
 *         this.locale.definePreferredLocale('en', 'US', 30);
 *  
 *         // Optional: default currency (ISO 4217 three-letter code).
 *         this.locale.definePreferredCurrency('USD');
 * 
 *     }
 * 
 * }
 * 
 * Changing language.
 * 
 * To change language at runtime, call the following methods:
 *  
 * this.locale.setCurrentLanguage(language);
 * this.localization.updateTranslation(); // Need to update the translation.
 * 
 * where 'language' is the two-letter or three-letter code of the new language (ISO 639).
 * 
 * 
 * Changing locale.
 * 
 * To change locale at runtime, call the following methods:
 *  
 * this.locale.setCurrentLocale(language, country);
 * this.localization.updateTranslation(); // Need to update the translation.
 * 
 * where 'language' is the two-letter or three-letter code of the new language (ISO 639)
 * and 'country' is the two-letter, uppercase code of the new country (ISO 3166).
 *
 * 
 * Changing currency.
 * 
 * To change currency at runtime, call the following method:
 *  
 * this.locale.setCurrentCurrency(currency);
 * 
 * where 'currency' is the three-letter code of the new currency (ISO 4217).
 * 
 * @author Roberto Simonetti
 */
@Injectable() export class LocaleService {

    /**
     * Output for event current language code changed.
     */
    @Output() languageCodeChanged = new EventEmitter<string>();

    /**
     * Output for event current country code changed.
     */
    @Output() countryCodeChanged = new EventEmitter<string>();

    /**
     * Output for event current currency code changed.
     */
    @Output() currencyCodeChanged = new EventEmitter<string>();

    /**
     * Output for event script code changed.
     */
    @Output() scriptCodeChanged = new EventEmitter<string>();

    /**
     * Output for event numbering system changed.
     */
    @Output() numberingSystemChanged = new EventEmitter<string>();

    /**
     * Output for event calendar changed.
     */
    @Output() calendarChanged = new EventEmitter<string>();

    /**
     * Current language code.
     */
    private languageCode: string;

    /**
     * Current country code.
     */
    private countryCode: string;

    /**
     * Current currency code.
     */
    private currencyCode: string;

    /**
     * Default locale.
     */
    private defaultLocale: string;

    /**
     * The available language codes.
     */
    private languageCodes: Array<string> = [];

    /**
     * Defines when the cookie will be removed.
     */
    private expiry: number;

    /**
     * The optional script code.
     */
    private scriptCode: string;

    /**
     * The optional numbering system.
     */
    private numberingSystem: string;

    /**
     * The optional calendar.
     */
    private calendar: string;

    /**
     * Reference counter for the service. 
     */
    private static referenceCounter: number = 0;

    /**
     * Enable/disable cookie.
     */
    public enableCookie: boolean = false;

    constructor() {

        this.languageCode = "";
        this.countryCode = "";
        this.currencyCode = "";
        this.defaultLocale = "";

        this.scriptCode = "";
        this.numberingSystem = "";
        this.calendar = "";

        // Counts the reference to the service.
        LocaleService.referenceCounter++;

        // Enables the cookies for the first instance of the service (see issue #11).
        if (LocaleService.referenceCounter == 1) {

            this.enableCookie = true;

        }

    }

    /**
     * Adds a new language.
     * 
     * @param language The two-letter or three-letter code of the new language
     */
    addLanguage(language: string) {

        this.languageCodes.push(language);

    }

    /**
     * Defines the preferred language. 
     * Selects the current language of the browser if it has been added, else the default language. 
     * 
     * @param defaultLanguage The two-letter or three-letter code of the default language
     * @param expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
     */
    definePreferredLanguage(defaultLanguage: string, expiry?: number) {

        this.expiry = expiry;

        // Parses the cookie "locale" to extract the codes.
        this.parseCookie("locale");

        if (this.languageCode == "") {

            // Gets the current language of the browser or the default language.
            var browserLanguage: string = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;

            var index: number = browserLanguage.indexOf('-');
            if (index != -1) {

                browserLanguage = browserLanguage.substring(0, index); // Gets the language code.

            }

            if (this.languageCodes.length > 0 && this.languageCodes.indexOf(browserLanguage) != -1) {

                this.languageCode = browserLanguage;

            } else {

                this.languageCode = defaultLanguage;

            }

        }

        // Sets the default locale.
        this.setDefaultLocale();

    }

    /**
     * Defines preferred languange and country, regardless of the browser language.
     * 
     * @param defaultLanguage The two-letter or three-letter code of the default language
     * @param defaultCountry The two-letter, uppercase code of the default country
     * @param expiry Number of days on the expiry. If omitted, the cookie becomes a session cookie
     * @param script The optional four-letter script code
     * @param numberingSystem The optional numbering system to be used
     * @param calendar The optional calendar to be used
     */
    definePreferredLocale(defaultLanguage: string, defaultCountry: string, expiry?: number, script: string = "", numberingSystem: string = "", calendar: string = "") {

        this.expiry = expiry;

        // Parses the cookie "locale" to extract the codes & the extension.
        this.parseCookie("locale");

        if (this.languageCode == "" || this.countryCode == "") {

            this.languageCode = defaultLanguage;
            this.countryCode = defaultCountry;
            this.scriptCode = script;
            this.numberingSystem = numberingSystem;
            this.calendar = calendar;

        }

        // Sets the default locale.
        this.setDefaultLocale();

    }

    /**
     * Defines the preferred currency. 
     * 
     * @param defaultCurrency The three-letter code of the default currency
     */
    definePreferredCurrency(defaultCurrency: string) {

        // Parses the cookie "currency" to extract the code.
        this.parseCookie("currency");

        if (this.currencyCode == "") {

            this.currencyCode = defaultCurrency;

        }

        // Sets the cookie "currency".
        if (this.enableCookie == true && this.languageCodes.length > 0) {

            this.setCookie("currency", this.currencyCode, this.expiry);

        }

    }

    /**
     * Gets the current language.
     * 
     * @return The two-letter or three-letter code of the current language
     */
    getCurrentLanguage(): string {

        return this.languageCode;

    }

    /**
     * Gets the current country.
     * 
     * @return The two-letter, uppercase code of the current country
     */
    getCurrentCountry(): string {

        return this.countryCode;

    }

    /**
     * Gets the current currency.
     * 
     * @return The three-letter code of the current currency
     */
    getCurrentCurrency(): string {

        return this.currencyCode;

    }

    /**
     * Gets the script.
     * 
     * @return The four-letter code of the script
     */
    getScript(): string {

        return this.scriptCode;

    }

    /**
     * Gets the numbering system.
     * 
     * @return The numbering system
     */
    getNumberingSystem(): string {

        return this.numberingSystem;

    }

    /**
     * Gets the calendar.
     * 
     * @return The calendar
     */
    getCalendar(): string {

        return this.calendar;

    }

    /**
     * Sets the current language.
     * 
     * @param language The two-letter or three-letter code of the new language
     */
    setCurrentLanguage(language: string) {

        // Checks if the language has changed.
        if (this.languageCode != language) {

            this.languageCode = language;

            // Sets the default locale.
            this.setDefaultLocale();

            // Sends an event.
            this.languageCodeChanged.emit(language);

        }

    }

    /**
     * Sets the current country.
     * 
     * @param country The two-letter, uppercase code of the new country
     */
    setCurrentCountry(country: string) {

        // Checks if the country has changed.
        if (this.countryCode != country) {

            this.countryCode = country;

            // Sets the default locale.
            this.setDefaultLocale();

            // Sends an event.
            this.countryCodeChanged.emit(country);

        }

    }

    /**
     * Sets the current locale.
     * 
     * @param language The two-letter or three-letter code of the new language
     * @param country The two-letter, uppercase code of the new country
     * @param script The optional four-letter script code
     * @param numberingSystem The optional numbering system to be used
     * @param calendar The optional calendar to be used
     */
    setCurrentLocale(language: string, country: string, script: string = "", numberingSystem: string = "", calendar: string = "") {

        // Checks if language, country, script or extension have changed.
        if (this.languageCode != language || this.countryCode != country || this.scriptCode != script || this.numberingSystem != numberingSystem || this.calendar != calendar) {

            this.languageCode = language;
            this.countryCode = country;
            this.scriptCode = script;
            this.numberingSystem = numberingSystem;
            this.calendar = calendar;

            // Sets the default locale.
            this.setDefaultLocale();

            // Sends the events.     
            this.languageCodeChanged.emit(language);
            this.countryCodeChanged.emit(country);
            this.scriptCodeChanged.emit(script);
            this.numberingSystemChanged.emit(numberingSystem);
            this.calendarChanged.emit(calendar);

        }

    }

    /**
     * Sets the current currency.
     * 
     * @param currency The three-letter code of the new currency
     */
    setCurrentCurrency(currency: string) {

        // Checks if the currency has changed.
        if (this.currencyCode != currency) {

            this.currencyCode = currency;

            // Sets the cookie "currency".
            if (this.enableCookie == true && this.languageCodes.length > 0) {

                this.setCookie("currency", this.currencyCode, this.expiry);

            }

            // Sends an event.
            this.currencyCodeChanged.emit(currency);

        }

    }

    /**
     * Gets the default locale.
     * 
     * @return The default locale
     */
    getDefaultLocale(): string {

        return this.defaultLocale;

    }

    /**
     * Builds the default locale.
     */
    private setDefaultLocale() {

        this.defaultLocale = this.languageCode

        this.defaultLocale += this.scriptCode != "" ? "-" + this.scriptCode : "";

        this.defaultLocale += this.countryCode != "" ? "-" + this.countryCode : "";

        // Builds the extension.
        // Adds the 'u' (Unicode) extension.
        this.defaultLocale += this.numberingSystem != "" || this.calendar != "" ? "-u" : "";
        // Adds numbering system.
        this.defaultLocale += this.numberingSystem != "" ? "-nu-" + this.numberingSystem : "";
        // Adds calendar.
        this.defaultLocale += this.calendar != "" ? "-ca-" + this.calendar : "";

        // Sets the cookie "locale".
        if (this.enableCookie == true && this.languageCodes.length > 0) {

            this.setCookie("locale", this.defaultLocale, this.expiry);

        }

    }

    /**
     * Parses the cookie to extract the codes & the extension.
     * 
     * @param name The name of the cookie
     */
    private parseCookie(name: string) {

        // Tries to get the cookie.
        var cookie: string = this.getCookie(name);

        // Looks for the 'u' (Unicode) extension.
        var index: number = cookie.search('-u');
        if (index != -1) {

            var extensions: string[] = cookie.substring(index + 1).split('-');
            switch (extensions.length) {

                case 3:
                    if (extensions[1] == "nu") this.numberingSystem = extensions[2];
                    else if (extensions[1] == "ca") this.calendar = extensions[2];
                    break;
                case 5:
                    this.numberingSystem = extensions[2];
                    this.calendar = extensions[4];
                    break;

            }

            // Extracts the codes.
            cookie = cookie.substring(0, index);

        }

        // Splits the cookie to each hyphen.
        var codes: string[] = cookie.split('-');

        switch (codes.length) {

            case 1:
                if (name == "locale") this.languageCode = codes[0];
                else if (name == "currency") this.currencyCode = codes[0];
                break;
            case 2:
                this.languageCode = codes[0];
                this.countryCode = codes[1];
                break;
            case 3:
                this.languageCode = codes[0];
                this.scriptCode = codes[1];
                this.countryCode = codes[2];
                break;

        }

    }

    /**
     * Sets the cookie.
     * 
     * @param name The name of the cookie
     * @param value The value of the cookie
     * @param days Number of days on the expiry
     */
    private setCookie(name: string, value: string, days?: number) {

        if (days != null) {

            // Adds the expiry date (in UTC time).
            var expirationDate: Date = new Date();

            expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));

            var expires: string = "; expires=" + expirationDate.toUTCString();

        } else {

            // By default, the cookie is deleted when the browser is closed.
            var expires: string = "";

        }

        // Creates the cookie.
        document.cookie = name + "=" + value + expires + "; path=/";

    }

    /**
     * Gets the cookie.
     * 
     * @param name The name of the cookie
     * @return The value of the cookie
     */
    private getCookie(name: string): string {

        // The text to search for.
        name += "=";

        // Splits document.cookie on semicolons into an array.
        var ca: string[] = document.cookie.split(';');

        // Loops through the ca array, and reads out each value.
        for (var i = 0; i < ca.length; i++) {

            var c: string = ca[i];

            while (c.charAt(0) == ' ') {

                c = c.substring(1);

            }
            // If the cookie is found, returns the value of the cookie.
            if (c.indexOf(name) == 0) {

                return c.substring(name.length, c.length);

            }
        }

        // If the cookie is not found, returns an empty string.
        return "";

    }

}