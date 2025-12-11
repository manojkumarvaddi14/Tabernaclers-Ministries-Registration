import { useState } from 'react';
import './App.css';

// === FINAL GOOGLE FORM CONFIGURATION ===
// Submission URL derived from the embedded link you provided
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSefMxMst5_WBdwvixPOtrbWPTIWdOF9GMy0kk11kQsLXg-_Bw/formResponse";

// Mapped form fields to the Google Form's entry IDs provided by you
const FIELD_IDS = {
    NAME: "entry.2112083089",          
    PHONE: "entry.191136437",         
    LOCATION: "entry.398155023",      
    INVITED_THROUGH: "entry.1465180738",
    REFERENCED_BY: "entry.511397093",  
};
// =======================================

const App = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        invitedThrough: 'Instagram',
        referencedBy: '',
        referenceText: '',
    });
    const [showReferenceInput, setShowReferenceInput] = useState(false);
    const [message, setMessage] = useState('');

    // Background Image URL
    const BACKGROUND_IMAGE_URL = "https://www.dropbox.com/scl/fi/tndurdxpo6apiaoe0geb3/IMG-20251203-WA0009.jpg?rlkey=7pfkaewheleta8c9q283beeog&e=1&st=okrzqclv&dl=1";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReferencedByChange = (e) => {
        const value = e.target.value;
        const shouldShowInput = value === 'Other'; 
        
        setFormData({
            ...formData,
            referencedBy: value, 
            referenceText: shouldShowInput ? formData.referenceText : '', 
        });
        setShowReferenceInput(shouldShowInput);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Submitting...');
        
        // 1. Determine final referencedBy value (use the 15-char text if 'Other' is checked)
        const finalReferencedBy = formData.referencedBy === 'Other' 
                                  ? formData.referenceText 
                                  : formData.referencedBy;

        // 2. Prepare data as URL-encoded form data (required by Google Forms)
        const data = new URLSearchParams();
        data.append(FIELD_IDS.NAME, formData.name);
        data.append(FIELD_IDS.PHONE, formData.phone);
        data.append(FIELD_IDS.LOCATION, formData.location);
        data.append(FIELD_IDS.INVITED_THROUGH, formData.invitedThrough);
        data.append(FIELD_IDS.REFERENCED_BY, finalReferencedBy);
        
        try {
            // 3. Submit the data using POST request
            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data,
                mode: 'no-cors', // Essential for submitting data to external endpoint like Google Forms
            });

            // If fetch succeeds, we assume data was sent (due to 'no-cors')
            setMessage('Registration Successfully!');
            setFormData({ // Reset form
                name: '', phone: '', location: '', invitedThrough: 'Instagram', referencedBy: '', referenceText: '',
            });
            setShowReferenceInput(false);
            
        } catch (error) {
            setMessage('Network error. Could not submit the form.');
        }
    };

    return (
        <div className="app-container" style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}>
            <div className="form-wrapper">
                <header className="header">
                    <h1>Register Now</h1>
                    <p>Join our community and get the latest updates!</p>
                </header>
                
                <form onSubmit={handleSubmit} className="register-form">
                    
                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    
                    {/* Phone Number (10 Digits Max) */}
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number (10 Digits):</label>
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
                        <label htmlFor="location">Location (10 Chars Max):</label>
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} maxLength={10} required />
                    </div>
                    
                    {/* Invited Through */}
                    <div className="form-group">
                        <label>How did you hear about us?</label>
                        <div className="radio-group">
                            {['Instagram', 'Youtube', 'Posters', 'Pamplets'].map(option => (
                                <label key={option}><input type="radio" name="invitedThrough" value={option} checked={formData.invitedThrough === option} onChange={handleChange} /> {option}</label>
                            ))}
                        </div>
                    </div>

                    {/* Referenced By */}
                    <div className="form-group">
                        <label>Referenced By:</label>
                        <div className="radio-group">
                            {['Friend', 'Family', 'Other'].map(option => (
                                <label key={option}><input type="radio" name="referencedBy" value={option} checked={formData.referencedBy === option} onChange={handleReferencedByChange} /> {option}</label>
                            ))}
                        </div>
                        {/* Conditional Text Input (15 Characters Max) */}
                        {showReferenceInput && (
                            <input 
                                type="text" 
                                name="referenceText" 
                                value={formData.referenceText} 
                                onChange={handleChange} 
                                placeholder="Enter reference (15 Chars Max)"
                                maxLength={15} 
                                required
                            />
                        )}
                    </div>
                    
                    <button type="submit" className="submit-button">Submit</button>
                    {message && <p className="message">{message}</p>}
                </form>

                <div className="social-links">
                    <h2>Follow Us!</h2>
                    <a href="https://www.youtube.com/@GeorgeSambathini/featured" target="_blank" rel="noopener noreferrer" className="social-button youtube-btn">YouTube Channel</a>
                    <a href="https://whatsapp.com/channel/0029VbBL7jd9hXEzBzWMTH2W" target="_blank" rel="noopener noreferrer" className="social-button whatsapp-btn">WhatsApp Channel</a>
                    <a href="https://www.instagram.com/georgethomassambathini/" target="_blank" rel="noopener noreferrer" className="social-button instagram-btn">Instagram Page</a>
                </div>

                <footer>
                    <p>&copy; 2025 George Sambathini</p>
                </footer>
            </div>
        </div>
    );
}

export default App;