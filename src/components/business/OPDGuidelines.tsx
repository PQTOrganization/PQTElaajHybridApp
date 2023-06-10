import {
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
} from '@mui/material';
import GridDX from '../layout/griddx';
import ButtonDX from '../controls/buttondx';

const guideLineData = [
	{
		title: 'Information should be Complete',

		description:
			'Only completely filled out claims will be processed - any vital information that is missing will deem the claim void and not payable. Please take care in filling out information that clearly identifies yourself and mentions all information asked for. The Elaaj app is the best and most acceptable mode of submitting your OPD Claim and will be the sole mode of claim submission in the near future.',
	},
	{
		title: 'Timelines for OPD Claims',

		description:
			'OPD Claims are to be submitted by the 20th of every month and payments will be disbursed with the monthly payroll. Claims submitted after the 20th will be paid in the following month. Please follow timelines as timely submission means timely payroll processing – any exceptions to this cause delays and issues for everyone. Claims up to 60 days old only may be processed.',
	},
	{
		title: 'High-Level Requirements',

		description:
			'All receipts must be accompanied by a Doctors prescription except for over-the-counter medications whose prescription is not required – details are available with us. Please use prescription photocopies for repeating claims. In case of availing discounts, please mention the discounted amounts for reimbursement. Please purchase medicines from outlets where computer-printed receipts with proper invoice/receipt numbers are printed. Please carefully track your own OPD claims and always keep scans of documents for your record',
	},
	{
		title: 'Exceptions – what will not be Reimbursed',

		description:
			'Formula milk, Ensure milk, non-medically needed dental treatment, eyeglasses/optical equipment, oils – further details are available with us. Additionally, any claims involving hospitalization may not be processed through this channel - please use the hospitalization claim reimbursement form for the purpose – this is available with HR. Any claims that have false information and/or counterfeit documents will be deemed to be misconduct on the part of the employee may result in benefit cessation/serious disciplinary action.',
	},
	{
		title: 'Further Important Notes',

		description:
			'Pak-Qatar reserves the right to decline reimbursement of any claims it deems unfit for payment. OPD is not to be treated as an employee right – it is a benefit provided by the Company. Employees are advised to take due care in submitting claims and use this benefit judiciously to safeguard PQ’s interests. Self-medication is harmful & a health hazard and will cause severe physical harm. Please discuss your health and medical needs with a professional before purchasing medicines. Physical health and emotionally uplifting activities – including meditation – are preventative measures that reduce the need for dangerous/injurious medications.',
	},
];

export default function OPDGuidelines(props: any) {
	return (
		<div>
			<Dialog
				open={props.open}
				onClose={props.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<GridDX container sx={{ width: '100%', alignContent: 'flex-start' }} rowSpacing={1}>
					<DialogContent>
						<DialogContentText id="alert-dialog-description" sx={{ color: 'black' }}>
							<GridDX item xs={12} justifyContent="center">
								<h1>OPD GUIDELINE</h1>
							</GridDX>
							<GridDX item xs={12}>
								<h3>{'>> Pak-Qatar Group'}</h3>
							</GridDX>
							{guideLineData.map((guideline, index) => {
								return (
									<GridDX item xs={12}>
										<Typography sx={{ fontSize: '14px' }}>
											<span style={{ fontSize: '20px', fontWeight: '500' }}>
												{index + 1}.{guideline.title}
											</span>
											<br />
											<br />
											{guideline.description}
										</Typography>
									</GridDX>
								);
							})}
						</DialogContentText>
					</DialogContent>
					<GridDX
						item
						xs={12}
						sx={{
							position: 'sticky',
							bottom: '0',
							background: '#ffff',
						}}
						justifyContent="center"
					>
						<DialogActions>
							<ButtonDX color="success" fullWidth onClick={props.handleClose}>
								ACCEPT & PROCEED
							</ButtonDX>
						</DialogActions>
					</GridDX>
				</GridDX>
			</Dialog>
		</div>
	);
}
