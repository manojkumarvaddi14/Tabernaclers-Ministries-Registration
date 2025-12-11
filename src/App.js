import { useState } from 'react';
import './App.css';

// === CONFIGURATION CONSTANTS ===
// These IDs must match the fields in your Google Form
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSefMxMst5_WBdwvixPOtrbWPTIWdOF9GMy0kk11kQsLXg-_Bw/formResponse";

const FIELD_IDS = {
    NAME: "entry.2112083089",          
    PHONE: "entry.191136437",         
    LOCATION: "entry.398155023",      
    INVITED_THROUGH: "entry.1465180738",
    REFERENCED_BY: "entry.511397093",  
    // !!! NEW ID: YOU MUST REPLACE THIS WITH YOUR ACTUAL "Reference Name" FIELD ID !!!
    REFERENCE_NAME: "entry.824521343", 
};

const BACKGROUND_IMAGE_URL = "https://www.dropbox.com/scl/fi/tndurdxpo6apiaoe0geb3/IMG-20251203-WA0009.jpg?rlkey=7pfkaewheleta8c9q283beeog&e=1&st=okrzqclv&dl=1";

const INITIAL_FORM_DATA = {
    name: '', 
    phone: '', 
    location: '', 
    invitedThrough: 'Instagram', 
    referencedBy: '', 
    // New field for the conditional input
    referenceName: '', 
    referenceText: '', // Kept for consistency, but logic shifts to referenceName
};

// --- Component 1: Social Links Component ---
const SocialLinks = () => (
    <div className="social-links">
        <h2>Follow Us!</h2>
        <div className="social-icon-group">
            <a href="https://www.youtube.com/@GeorgeSambathini/featured" target="_blank" rel="noopener noreferrer" className="social-button youtube-btn" aria-label="YouTube Channel"></a>
            <a href="https://whatsapp.com/channel/0029VbBL7jd9hXEzBzWMTH2W" target="_blank" rel="noopener noreferrer" className="social-button whatsapp-btn" aria-label="WhatsApp Channel"></a>
            <a href="https://www.instagram.com/georgethomassambathini/" target="_blank" rel="noopener noreferrer" className="social-button instagram-btn" aria-label="Instagram Page"></a>
        </div>
    </div>
);

// --- Component 2: Success Message Display ---
const SuccessMessage = ({ onReset }) => (
    <div className="success-container">
        <div className="success-icon">🎉</div>
        <h2>Registration Successful!</h2>
        <p>Thank yourself for subscribing and registering.</p>
        <p>We look forward to connecting with you!</p>
        <button onClick={onReset} className="submit-button success-button">Register Another</button>
        <SocialLinks /> 
    </div>
);


// --- Component 3: Main Registration Form ---
const RegistrationForm = ({ 
    formData, 
    showReferenceInput, 
    message, 
    handleChange, 
    handleReferencedByChange, 
    handleSubmit 
}) => {
    
    const invitedOptions = ['Instagram', 'Youtube', 'Posters', 'Pamplets'];
    const referenceOptions = ['Friend', 'Family', 'Other'];

    return (
        <>
            <header className="header">
                <h1>Register Now!</h1>
                <p>Join our community and get the latest updates!</p>
            </header>
            
            <form onSubmit={handleSubmit} className="register-form">
                
                {/* Full Name */}
                <div className="form-group">
                    <label htmlFor="name">Full Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                
                {/* Phone Number (10 Digits Max) */}
                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        maxLength={10} 
                        pattern="[0-9]{10}"
                        title="Phone number must be exactly 10 digits"
                        required 
                    />
                </div>
                
                {/* Location (10 Chars Max) */}
                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} maxLength={10} required />
                </div>
                
                {/* Invited Through */}
                <div className="form-group">
                    <label>How did you hear about us?</label>
                    <div className="radio-group">
                        {invitedOptions.map(option => (
                            <label key={option}>
                                <input 
                                    type="radio" 
                                    name="invitedThrough" 
                                    value={option} 
                                    checked={formData.invitedThrough === option} 
                                    onChange={handleChange} 
                                /> {option}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Referenced By (Source) */}
                <div className="form-group">
                    <label>Referenced By (Source):</label>
                    <div className="radio-group">
                        {referenceOptions.map(option => (
                            <label key={option}>
                                <input 
                                    type="radio" 
                                    name="referencedBy" 
                                    value={option} 
                                    checked={formData.referencedBy === option} 
                                    onChange={handleReferencedByChange} 
                                /> {option}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Reference Name (NEW DEDICATED FIELD) */}
                {showReferenceInput && (
                    <div className="form-group">
                        <label htmlFor="referenceName">Reference Name (Max 25 Chars):</label>
                        <input 
                            type="text" 
                            id="referenceName"
                            name="referenceName" 
                            value={formData.referenceName} 
                            onChange={handleChange} 
                            placeholder="Enter the name of the person/source"
                            maxLength={25} 
                            required
                        />
                    </div>
                )}
                
                <button type="submit" className="submit-button">Submit</button>
                {message && <p className="message">{message}</p>}
            </form>
        </>
    );
}

// --- Component 4: Main App Container and Logic ---
const App = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    // Show reference input if any 'Referenced By' radio button is selected
    const [showReferenceInput, setShowReferenceInput] = useState(false); 
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); 

    const handleReset = () => {
        setFormData(INITIAL_FORM_DATA);
        setIsSubmitted(false);
        setMessage('');
        setShowReferenceInput(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReferencedByChange = (e) => {
        const value = e.target.value;
        
        // Show the referenceName input if a radio button is selected
        const shouldShowInput = value.length > 0; 
        
        setFormData({
            ...formData,
            referencedBy: value, 
            // Clear the referenceName when the source changes, unless the same source is re-selected
            referenceName: shouldShowInput ? formData.referenceName : '', 
        });
        setShowReferenceInput(shouldShowInput);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Submitting...');
        
        // Prepare data for Google Forms submission
        const data = new URLSearchParams();
        data.append(FIELD_IDS.NAME, formData.name);
        data.append(FIELD_IDS.PHONE, formData.phone);
        data.append(FIELD_IDS.LOCATION, formData.location);
        data.append(FIELD_IDS.INVITED_THROUGH, formData.invitedThrough);
        
        // Data for 'Referenced By (Source)'
        data.append(FIELD_IDS.REFERENCED_BY, formData.referencedBy); 

        // Data for 'Reference Name' (only included if input was shown/data exists)
        if (formData.referenceName) {
            data.append(FIELD_IDS.REFERENCE_NAME, formData.referenceName); 
        }
        
        try {
            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
                mode: 'no-cors', // Key for Google Forms integration
            });

            // Submission successful
            setIsSubmitted(true);
            setMessage('');
            
        } catch (error) {
            setMessage('Network error. Could not submit the form.');
            setIsSubmitted(false);
        }
    };

    return (
        <div className="app-container" style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}>
            <div className="content-container"> 
                <div className="form-wrapper">
                    
                    {isSubmitted ? (
                        <SuccessMessage onReset={handleReset} />
                    ) : (
                        <RegistrationForm 
                            formData={formData}
                            showReferenceInput={showReferenceInput}
                            message={message}
                            handleChange={handleChange}
                            handleReferencedByChange={handleReferencedByChange}
                            handleSubmit={handleSubmit}
                        />
                    )}
                </div>
                
                {/* --- FOOTER CONTENT --- */}
                <SocialLinks />
                <footer>
                    <p>&copy; 2025 George Sambathini</p>
                </footer>
                {/* ---------------------- */}

            </div>
        </div>
    );
}

export default App;