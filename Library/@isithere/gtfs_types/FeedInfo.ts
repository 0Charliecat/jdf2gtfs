export class FeedInfo {
    publisherName: string;
    publisherUrl: string;
    lang: string;
    defaultLang?: string;
    start?: Date;
    end?: Date;
    version?: string;
    contactEmail?: string;
    contactUrl?: string;

    constructor(init: {
        publisherName: string,
        publisherUrl: string,
        lang: string,
        defaultLang?: string,
        start?: Date,
        end?: Date,
        version?: string,
        contactEmail?: string,
        contactUrl?: string
    }) {
        this.publisherName = init.publisherName;
        this.publisherUrl = init.publisherUrl;
        this.lang = init.lang;
        this.defaultLang = init.defaultLang;
        this.start = init.start;
        this.end = init.end;
        this.version = init.version;
        this.contactEmail = init.contactEmail;
        this.contactUrl = init.contactUrl;
    }

    public toString() {
        return this.publisherName;
    }

    public toJSON() {
        return {
            "feed_publisher_name": this.publisherName,
            "feed_publisher_url": this.publisherUrl,
            "feed_lang": this.lang,
            "default_lang": this.defaultLang,
            "feed_start_date": this.start,
            "feed_end_date": this.end,
            "feed_version": this.version,
            "feed_contact_email": this.contactEmail,
            "feed_contact_url": this.contactUrl
        }
    }
}

export interface GTFSFeedInfoObject {
	feed_publisher_name: string;
	feed_puiblisher_url: string;
	feed_lang: string;
	default_lang?: string;
	feed_start_date?: string;
	feed_end_date?: string;
	feed_version?: string;
	feed_contact_email?: string;
	feed_contact_url: string;
}