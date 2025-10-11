import React from 'react';
import '../css/Contact.css';

const Contact: React.FC = () => {
    return (
        <section className="contact-page">
            <div className="contact-wrap">
                {/* Left */}
                <div className="contact-content">
                    <h1 className="contact-title">
                        WE’D LOVE TO HEAR FROM YOU.
                    </h1>

                    <p className="contact-lead">
                        Do you want to support our programs? Do you have an idea
                        for a new way for us to make even more dreams come true?
                        We’d love to hear from you.
                    </p>

                    <ul className="contact-list">
                        <li>
                            Contact us at:{' '}
                            <a
                                className="contact-link"
                                href="mailto:info@bworks.org"
                            >
                                info@bworks.org
                            </a>
                        </li>
                        <li>
                            Phone:{' '}
                            <a className="contact-link" href="tel:3146640828">
                                314-664-0828
                            </a>
                        </li>
                    </ul>

                    <p className="contact-note">
                        You can also stop by and see us in person on{' '}
                        <strong>Tuesday / Thursday or Saturday.</strong>
                    </p>
                </div>

                {/* Right images */}
                <div className="contact-photos">
                    <div className="photo photo--lg">
                        <img src="/cycle.jpg" alt="BWorks bike" />
                    </div>
                    <div className="photo photo--sm">
                        <img src="/image.jpg" alt="BWorks kids" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
