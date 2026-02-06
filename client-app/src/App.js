import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginPage from './Components/LoginPage';
import Popup from './Components/LoginPopup.tsx';
import Register from './Components/Register.tsx';
import Home from './Components/Home.tsx';
import ForgotPassword from './Components/ForgotPassword.tsx';
import ResetPasswordPage from './Components/ResetPasswordPage.tsx';
import DonatedItemsList from './Components/DonatedItemsList';
import DonorForm from './Components/DonorForm.tsx';
import StatusUpdate from './Components/AddNewStatus';
import Programs from './Components/Programs';
import AddProgramPage from './Components/AddProgramPage';
import EditProgramPage from './Components/EditProgramPage';
import NewItemForm from './Components/NewItemForm.tsx';
import DonorList from './Components/DonorList.tsx';
import DonatedItemDetails from './Components/DonatedItemDetails';
import DonorEdit from './Components/DonorEdit.tsx';
import DonorProfile from './Components/DonorProfile';
import ProtectedRoute from './Components/ProtectedRoute';
import DonorDonations from './Components/DonorDonations';
import Contact from './Components/Contact.tsx';
import Footer from './Components/Footer.tsx';
import AdminImageReview from './Components/AdminImageReview';
import BarcodeDisplay from './Components/BarcodeDisplay'; // added import
import AdminUserManagement from './Components/AdminUserManagement';

// Small wrapper page to read :id and render BarcodeDisplay
function DonatedBarcodePage() {
    const { id } = useParams();
    if (!id) return <div>Missing donated item id</div>;
    return <BarcodeDisplay donatedItemId={id} format="svg" />;
}

function App() {
    const handleAddProgram = formData => {
        console.log('Adding new program:', formData);
    };

    return (
        <div
            className="App"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                position: 'relative',
                // remove the white space keeping space reserved for footer
            }}
        >
            <Popup.PopupProvider>
                <Navbar />
                <main style={{ flex: '1 0 auto' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<Home />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/reset-password"
                            element={<ResetPasswordPage />}
                        />
                        <Route
                            path="/donatedItem/status/:id"
                            element={<StatusUpdate />}
                        />
                        <Route path="/donorform" element={<DonorForm />} />
                        <Route path="/donoredit" element={<DonorEdit />} />
                        <Route path="/donorlist" element={<DonorList />} />
                        <Route
                            path="/donations"
                            element={<DonatedItemsList />}
                        />
                        <Route path="/programs" element={<Programs />} />
                        <Route
                            path="/addprogram"
                            element={
                                <AddProgramPage
                                    onAddProgram={handleAddProgram}
                                />
                            }
                        />
                        <Route
                            path="/editprogram"
                            element={<EditProgramPage />}
                        />
                        <Route path="/adddonation" element={<NewItemForm />} />
                        <Route
                            path="/donations/:id"
                            element={<DonatedItemDetails />}
                        />
                        <Route
                            path="/donor-profile"
                            element={
                                <ProtectedRoute allowedRole="DONOR">
                                    <DonorProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-donations"
                            element={
                                <ProtectedRoute allowedRole="DONOR">
                                    <DonorDonations />
                                </ProtectedRoute>
                            }
                        />
                        {/* New admin review route */}
                        <Route
                            path="/admin/image-review"
                            element={<AdminImageReview />}
                        />
                        <Route
                            path="/admin/user-management"
                            element={
                                <ProtectedRoute allowedRole="ADMIN">
                                    <AdminUserManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/image-review/:id"
                            element={
                                <ProtectedRoute allowedRole="ADMIN">
                                    <AdminImageReview />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/contact" element={<Contact />} />

                        {/* New routes: view barcode for a donated item (both variants) */}
                        <Route
                            path="/donated/:id/barcode"
                            element={<DonatedBarcodePage />}
                        />
                        <Route
                            path="/donations/:id/barcode"
                            element={<DonatedBarcodePage />}
                        />
                    </Routes>
                </main>
                <Footer />
            </Popup.PopupProvider>
        </div>
    );
}

export default App;
