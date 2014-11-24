<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="CrudeAssayEXTNET.Default" %>
<%@ Register Assembly="Ext.Net" Namespace="Ext.Net" TagPrefix="ext" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Crude Assay EXT.NET</title>
    <link rel="stylesheet" href="resources/css/main.css" />
    <script src="resources/js/main.js" type="text/javascript"></script>
</head>
<body>
    <ext:ResourceManager ID="ResourceManager1" runat="server" />
    <%--<ext:History ID="History1" runat="server">
		<Listeners>
			<Change Fn="change" />
		</Listeners>
	</ext:History>--%>
    <ext:TreeStore ID="TreeStore1" runat="server">
        <Root>
            <ext:Node NodeID="root" Expanded="true">
                <Children>
                    <ext:Node Text="Master Data" Icon="ApplicationDouble">
                        <Children>
                            <ext:Node Text="Master Data Crude" Href="/MasterData/MasterDataCrude/" Icon="ApplicationViewDetail" Leaf="true"></ext:Node>
                            <ext:Node Text="Master Data Laboratorium" Href="/MasterData/MasterDataLaboratory/" Icon="ApplicationViewDetail" Leaf="true"></ext:Node>
                            <ext:Node Text="Master Data Negara" Href="/MasterData/MasterDataNegara/" Icon="ApplicationViewDetail" Leaf="true"></ext:Node>
                        </Children>
                    </ext:Node>
                    <ext:Node Text="Upload Dokumen" Icon="ApplicationDouble">
                        <Children>
                            <ext:Node Text="Upload Dokumen Crude Assay" Href="/UploadDokumen/UploadDokumenCrudeAssay/" Icon="ApplicationViewDetail" Leaf="true"></ext:Node>
                        </Children>
                    </ext:Node>
                    <ext:Node Text="Input" Icon="ApplicationDouble">
                        <Children>
                            <ext:Node Text="Critical Parameter" Href="/Input/InputCriticalParameter/" Icon="ApplicationViewDetail" Leaf="true"></ext:Node>
                        </Children>
                    </ext:Node>
                    <ext:Node Text="Grafik" Icon="ApplicationDouble">
                        <Children>
                            <ext:Node Text="Grafik Crude Assay" Href="/Grafik/GrafikCrudeAssay/" Icon="ApplicationViewDetail" Leaf="true"></ext:Node>
                        </Children>
                    </ext:Node>
                </Children>
            </ext:Node>
        </Root>
    </ext:TreeStore>
    <ext:Viewport ID="ViewPort1" runat="server" Layout="BorderLayout">
        <Items>
            <ext:Panel ID="Panel1" runat="server" Header="false" Region="North" Border="false">
                <Content>
					<div id="titlebar">
						<div id="left">
							<%--<div class="minor">PERTAMINA</div>--%>
							<div class="title">Crude Assay <span class="title-sub">(Version 2.0)</span></div>
							<%--<div class="badge">ITSOL - CSS</div>--%>
						</div>
						<%--<div id="right"><a href="http://www.ext.net/"></a></div>--%>
						<div id="v1-samples">
							<a href="http://www.pertamina.com" target="_blank">Pertamina &#187;</a>
						</div>
					</div>
				</Content> 
            </ext:Panel>
            <ext:Panel ID="Panel2" runat="server" Region="West" Layout="FitLayout" Width="240" MaxWidth="300" MinWidth="200"
            Header="false" Collapsible="true" CollapseMode="Mini" Split="true" Margins="0 0 4 4" Border="false">
                <Items>
                    <ext:TreePanel ID="CrudeTreePanel" runat="server" AutoScroll="true" UseArrows="true" RootVisible="false" StoreID="TreeStore1">
                        <TopBar>
                            <ext:Toolbar ID="Toolbar1" runat="server">
                                <Items>
                                    <ext:TriggerField 
                                        ID="TriggerField1" 
                                        runat="server" 
                                        EnableKeyEvents="true" 
                                        Width="200"
                                        EmptyText="Filter Menu Crude...">
                                        <Triggers>
                                            <ext:FieldTrigger Icon="Clear" HideTrigger="true" />
                                        </Triggers>
                                        <Listeners>
                                            <KeyUp Fn="keyUp" Buffer="100" />
                                            <TriggerClick Fn="clearFilter" />
                                            <SpecialKey Fn="filterSpecialKey" />
                                        </Listeners>
                                    </ext:TriggerField>
                                    <ext:ToolbarFill ID="ToolbarFill1" runat="server" />
                                    <ext:Button ID="Button13" runat="server" Icon="Cog" ToolTip="Options">
                                        <Menu>
                                            <ext:Menu ID="Menu1" runat="server">
                                                <Items>
                                                    <ext:MenuItem ID="MenuItem1" runat="server" Text="Expand All" IconCls="icon-expand-all">
                                                        <Listeners>
                                                            <Click Handler="#{CrudeTreePanel}.expandAll(false);" />
                                                        </Listeners>
                                                    </ext:MenuItem>                
                                                    <ext:MenuItem ID="MenuItem2" runat="server" Text="Collapse All" IconCls="icon-collapse-all">
                                                        <Listeners>
                                                            <Click Handler="#{CrudeTreePanel}.collapseAll(false);" />
                                                        </Listeners>
                                                    </ext:MenuItem>
                                                    <ext:MenuSeparator ID="MenuSeparator1" runat="server" />
													<ext:MenuItem ID="MenuItem3" runat="server" Text="Theme" Icon="Paintcan">
														<Menu>
															<ext:Menu ID="Menu2" runat="server">
																<Items>
																	<ext:CheckMenuItem ID="DefaultThemeItem" runat="server" Text="Default" Group="theme" Checked="true" />
																	<ext:CheckMenuItem ID="GrayThemeItem" runat="server" Text="Gray" Group="theme" />
																	<ext:CheckMenuItem ID="AccessThemeItem" runat="server" Text="Access" Group="theme" />
																</Items>
																<Listeners>
																	<Click Handler="#{DirectMethods}.GetThemeUrl(menuItem.text,{
																		success : function (result) {
																			Ext.net.ResourceMgr.setTheme(result);
																			#{tabPanel1}.items.each(function (el) {
																				if (!Ext.isEmpty(el.iframe)) {
																					if (el.getBody().Ext) {
																						el.getBody().Ext.net.ResourceMgr.setTheme(result, menuItem.text.toLowerCase());
																					}
																				}
																			});
																		}
																	});" />
																</Listeners>
															</ext:Menu>
														</Menu>
													</ext:MenuItem>
                                                </Items>
                                            </ext:Menu>
                                        </Menu>
                                    </ext:Button>
                                </Items>
                            </ext:Toolbar>
                        </TopBar>
                        
                        <Listeners>
                            <ItemClick Handler="onTreeItemClick(record, e);" />
                            <AfterRender Fn="onTreeAfterRender" />
                        </Listeners>
                    </ext:TreePanel>
                </Items>
            </ext:Panel>
            <ext:TabPanel ID="tabPanel1" runat="server" Region="Center" Margins="0 4 4 0" EnableTabScroll="true" MinTabWidth="85">
                <Items>
                    <ext:Panel ID="tabHome" runat="server" Title="Dashboard" Icon="ChartCurve">
                        <Loader runat="server" Url="Dashboard/" Mode="Frame">
                            <LoadMask ShowMask="true" />
                        </Loader>
                    </ext:Panel>
                </Items>
                <%--<Listeners>
					<TabChange Fn="addToken" />
				</Listeners>--%>
                <Plugins>
                    <ext:TabCloseMenu ID="TabCloseMenu1" runat="server" />
                </Plugins>
            </ext:TabPanel>
        </Items>
    </ext:Viewport>
</body>

</html>
