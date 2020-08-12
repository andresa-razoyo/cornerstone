import utils from '@bigcommerce/stencil-utils';
import { defaultModal } from '../global/modal';
import TSApi from '../common/ts-api';
import TSCookie from '../common/ts-cookie';
import StatesSelect from '../common/directory/states';
import pagination from '../common/pagination';

export default function() {
    $(document).ready(function() {
        let party = new FindAParty(
            $('#partybar-find'),
            'common/find-party'
        );
    });
}

// Breakpoint for mobile
const SCREEN_MIN_WIDTH = 801;
// Number of page numbers to show in pagination
const DISPLAY_NUM_PAGES = 6;
const PAGE_SIZE = 10;

class FindAParty {
    constructor(trigger, template) {
        this.$findPartyBar = trigger.parent();

        this.$findPartyBarText = trigger.find(".partybar-text");

        this.$findPartyBarArrow = trigger.find(".fa-caret-right");

        this.$findPartyButtons = this.$findPartyBar.find(".partybar-accordion").find(".partybar-button");

        this.$viewPartyButton = $(this.$findPartyButtons[0])

        this.$switchPartyButton = $(this.$findPartyButtons[1])

        // Partybar Greeting Text
        const hostname = TSCookie.GetPartyHost();
        this.$findPartyBarText.html(this.partyGreeting(hostname));

        // API
        this.api = new TSApi();

        // Modal
        trigger.on('click', (e) => {
            if (!TSCookie.GetPartyId()) {
                this.createModal(e, template)
            } else {
                this.openDropdown(trigger)
            }
        });

        // View party button
        this.$viewPartyButton.on('click', () => {
          window.location.href = '/party-details';
        });

        // Switch party button
        this.$switchPartyButton.on('click', (e) => {
            this.createModal(e, template);
        });

        // Search by State / Name
        $('body').on('submit', '#state-search-form', () => {
            this.searchInfo = {
                state: $('#party-search .state-search select').val(),
                name: $('#party-search .state-search input').val(),
                page: 1
            };

            this.search();
        });

        // Select party
        $('body').on('click', '.party-card', (e) => this.selectParty(e));

        // Submit
        $('body').on('click', '#party-continue', () => this.continue());

        // Go back to search
        $('body').on('click', '#party-goback', () => this.returnSearch());
        $('body').on('click', '.return-search', () => this.returnSearch());

        // Move "Find a Party" bar into the main menu in mobile view
        this.movePartyElement(this.$findPartyBar);
        $(window).on('resize', () => this.movePartyElement(this.$findPartyBar));
    }

    createModal(e, template) {
        this.modal = defaultModal();
        e.preventDefault();
        this.modal.open({ size: 'small' });
        const options = { template: template };
        utils.api.getPage('/', options, (err, res) => {
            if (err) {
                console.error('Failed to get common/find-party. Error:', err);
                return false;
            } else if (res) {
                this.modalLoaded(res);
            }
        });
    }

    openDropdown(target) {
        target.toggleClass("active");

        let accord = target.next();
      
        if (accord.css("max-height") == "0px") {
            accord.css("max-height", (accord.prop('scrollHeight')));
        } else {
            accord.css("max-height", 0);
        }

        if (target.hasClass('active')) {
            // Change arrow pointing down when party bar opened
            this.$findPartyBarArrow.addClass('fa-caret-down').removeClass('fa-caret-right');
        } else {
            // Default
            this.$findPartyBarArrow.addClass('fa-caret-right').removeClass('fa-caret-down');
        }
    }

    partyGreeting(hostname) {
      if (hostname) {
        return `You\'re shopping in <strong>${hostname}\'s</strong> party`
      } else {
        return 'Find a party'
      }
    }

    modalLoaded(result) {
        this.modal.updateContent(result);
        let $nameSelects = $('#party-search .state-search select');
        for (let i = 0; i < $nameSelects.length; i++) {
            new StatesSelect($nameSelects[i]);
        }
    }

    search() {
        this.api.searchPartyByState(
            this.searchInfo.state,
            this.searchInfo.name,
            this.searchInfo.page,
            PAGE_SIZE
        )
        .then(res => res.json())
        .then(data => this.renderResults(data))
        .catch(err => {
            console.warn('searchByState', err);
            this.displayError(err);
        });
    }

    displayError(err) {
        $('.alertbox-error span').text(err);
        $('.alertbox-error').show();
    }

    goToPage(p) {
        this.searchInfo.page = p;
        this.search();
    }

    selectParty(e) {
        $('.alertbox-error').hide();
        let $partyCard = $(e.target).closest('.party-card');

        if (!$partyCard.hasClass('selected')) {
            this.selectedId = $partyCard.data('pid');
            $('.selected').toggleClass('selected');
        } else {
            this.selectedId = null;
        }

        $(e.target).closest('.party-card').toggleClass('selected');

        let partyName = $partyCard.data('phost');
        $('#you-have-selected').html(`You have selected <strong>${partyName}'s</strong> Party`);

        // Set cookies
        this.setCookies($partyCard);
    }

    continue() {
        if (this.selectedId) {
            // Redirect
            window.location.href = '/party-details';
        } else {
            this.displayError('Please select a party before continuing');
        }
    }

    setCookies($partyCard) {
        this.updatePartyCookies($partyCard);
        this.updateConsultantCookies($partyCard);
    }

    updatePartyCookies($card) {
        TSCookie.SetPartyId($card.data('pid'));
        TSCookie.SetPartyHost($card.data('phost'));
        TSCookie.SetPartyDate($card.data('pdate'));
        TSCookie.SetPartyTime($card.data('ptime'));
        TSCookie.SetPartyTotal($card.data('ptotal'));
    }

    updateConsultantCookies($card) {
        TSCookie.SetConsultantId($card.data('cid'));
        TSCookie.SetConsultantName($card.data('cname'));
    }

    movePartyElement($party) {
        let $navPages = $('.navPages-container .navPages');

        if (window.innerWidth >= SCREEN_MIN_WIDTH) {
            $('header').append($party);
        } else {
            $navPages.append($party);
        }
    }

    returnSearch() {
        $('#party-search-results').hide();
        $('.alertbox-error').hide();
        $('#party-search').show();
    }

    clearPartyWindow() {
        $('.party-card').remove();
        $('.party-pagination').remove();
        $('.party-footer').remove();
    }

    /*
     * HTML
     */
    renderResults(response) {
        $('#party-search').hide();
        this.clearPartyWindow();

        // List of Parties
        response.Results.forEach(party => {
            let $partyHtmlBlock = this.getPartyHtmlBlock(party);
            $('#party-search-results article').append($partyHtmlBlock);
        });

        $('#party-search-results').show();
        $('#party-search-results article').show();

        // Footer
        let $footerHtml = this.getFooterHtml();
        $('#party-search-results').append($footerHtml);

        if (response.Results.length === 0) {
            this.displayError('No party was found.');
            $('#party-search-results article').hide();
            $('#party-continue').hide();
            $('.return-search').hide();
            $('#party-goback').show();
            return;
        }

        // If only one party is found,
        // select that party automatically
        if (response.Results.length === 1) {
            let $partyCard = $('.party-card');
            this.selectedId = $partyCard.data('pid');
            $partyCard.addClass('selected');

            let partyName = $partyCard.data('phost');
            $('#you-have-selected').html(`You have selected <strong>${partyName}'s</strong> Party`);
            // Set cookies
            this.setCookies($partyCard);
        }

        // Pagination
        let $paginationContainer = $('<div>', {'class': 'party-pagination pagination'});
        $footerHtml.prepend($paginationContainer);

        pagination(
            $paginationContainer,
            response.CurrentPage,
            Math.ceil(response.TotalRecordCount / response.PageSize),
            DISPLAY_NUM_PAGES,
            ((p) => this.goToPage(p))
        );

        // Return search
        let $returnSearch = $('<div>', {'class': 'return-search'});
        $returnSearch.html(`
            <div class="vertical-center">
                <span class="icon-system-left-caret"></span>
            </div>
            <span class="frame-caption">Refine your search</span>
        `);

        $footerHtml.prepend($returnSearch);
    }

    getPartyHtmlBlock(party) {
        let $block = $('<div>', {
            'class'       : 'party-card result-card',
            'data-pid'    : party.PartyId,
            'data-phost'  : `${party.HostFirstName} ${party.HostLastName}`,
            'data-pdate'  : party.Date,
            'data-ptime'  : party.Time,
            'data-ptotal' : party.Total,
            'data-cid'    : party.ConsultantId,
            'data-cname'  : party.Consultant
        });

        let $selectedHeader = this.getSelectedHeaderHtml();
        $block.append($selectedHeader);
        let $partyInfo = this.getInfoHtml(party);
        $block.append($partyInfo);
        return $block;
    }

    getSelectedHeaderHtml() {
        let $selectedHeader = $('<div>', {'class': 'selected-header'});
        let $icon = $('<span>', {'class': 'icon-system-check'});
        $selectedHeader.append($icon);

        let $title = $('<h3>', {'class': 'selection-title'});
        $title.text('Current Party');
        $selectedHeader.append($title);

        return $selectedHeader;
    }

    getInfoHtml(party) {
        let $infoContainerHtml = $('<div>', {'class': 'party-info'});

        let $nameHtml = $('<h5>', {'class': 'party-name'});
        $nameHtml.text(`${party.HostFirstName} ${party.HostLastName}'s Party`);
        $infoContainerHtml.append($nameHtml);

        let $innerContainerHtml = $('<div>', {'class': 'system-12'});

        let $dateHtml = $('<div>');
        $dateHtml.html(`<span>Date: ${party.Date}</span>`);
        $innerContainerHtml.append($dateHtml);

        let $consultantHtml = $('<div>');
        $consultantHtml.html(`<span>Consultant: ${party.Consultant}</span>`);
        $innerContainerHtml.append($consultantHtml);

        $infoContainerHtml.append($innerContainerHtml);

        return $infoContainerHtml;
    }

    getFooterHtml() {
        let $footer = $('<div>', {'class': 'party-footer'});


        let $selectedNextContainer = $('<div>', {'class': 'party-selected-next'});
        $footer.append($selectedNextContainer);

        // You have selected <consultant> text
        let $youHaveSelected = $('<p>', {'id': 'you-have-selected', 'class': 'system-14'});
        $selectedNextContainer.append($youHaveSelected);

        // Continue button
        let $continueButton = $('<button>', {'id': 'party-continue', 'class': 'button-secondary-icon'});
        $continueButton.text('continue');
        $selectedNextContainer.append($continueButton);

        // Back button
        let $backButton = $('<button>', {'id': 'party-goback', 'class': 'button-primary'});
        $selectedNextContainer.append($backButton);
        $backButton.text('go back');
        $backButton.hide();

        return $footer;
    }
}
